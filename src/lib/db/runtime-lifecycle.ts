import {
  RUNTIME_PING_TIMEOUT_MS,
  RUNTIME_RECENT_LIVE_MS,
  isRetryableDbError,
  withTimeout,
} from "./connection";

export type RuntimeLifecycleDeps<TDb> = {
  create: () => void;
  ping: () => Promise<void>;
  recycle: () => Promise<void>;
  getDb: () => TDb;
  now?: () => number;
  shouldPing?: () => boolean;
  recentLiveMs?: number;
};

/**
 * Liveness + one retry around a stale postgres.js client.
 * Ping uses a client-side timeout; a timed-out idle client is recycled
 * because Promise.race cannot cancel the underlying query.
 *
 * Concurrent callers share one ping. A ping timeout never recycles a
 * client that already has in-flight work — that is a busy pool, not a
 * dead socket. `next build` skips the ping entirely.
 */
export function createRuntimeLifecycle<TDb>(deps: RuntimeLifecycleDeps<TDb>) {
  const now = deps.now ?? Date.now;
  const recentLiveMs = deps.recentLiveMs ?? RUNTIME_RECENT_LIVE_MS;
  let lastLiveAt = 0;
  let inFlight = 0;
  let pingInFlight: Promise<void> | null = null;

  async function pingLiveClient(): Promise<void> {
    await withTimeout(
      deps.ping(),
      RUNTIME_PING_TIMEOUT_MS,
      "runtime db liveness ping",
    );
  }

  async function recycleClient(): Promise<void> {
    lastLiveAt = 0;
    await deps.recycle();
  }

  function shouldSkipPing(): boolean {
    if (deps.shouldPing && !deps.shouldPing()) {
      return true;
    }
    if (inFlight > 0) {
      return true;
    }
    if (lastLiveAt > 0 && now() - lastLiveAt < recentLiveMs) {
      return true;
    }
    return false;
  }

  async function pingOrRecycle(): Promise<void> {
    try {
      await pingLiveClient();
      lastLiveAt = now();
    } catch {
      if (inFlight > 0) {
        return;
      }
      await recycleClient();
      deps.create();
      await pingLiveClient();
      lastLiveAt = now();
    }
  }

  async function ensureLiveRuntimeClient(): Promise<void> {
    deps.create();
    if (shouldSkipPing()) {
      return;
    }
    if (!pingInFlight) {
      pingInFlight = pingOrRecycle().finally(() => {
        pingInFlight = null;
      });
    }
    await pingInFlight;
  }

  async function run<T>(fn: (db: TDb) => Promise<T>): Promise<T> {
    inFlight += 1;
    try {
      const result = await fn(deps.getDb());
      lastLiveAt = now();
      return result;
    } finally {
      inFlight -= 1;
    }
  }

  async function withRuntimeDb<T>(fn: (db: TDb) => Promise<T>): Promise<T> {
    await ensureLiveRuntimeClient();
    try {
      return await run(fn);
    } catch (error) {
      if (!isRetryableDbError(error)) {
        throw error;
      }
      await recycleClient();
      await ensureLiveRuntimeClient();
      return await run(fn);
    }
  }

  return { ensureLiveRuntimeClient, withRuntimeDb };
}
