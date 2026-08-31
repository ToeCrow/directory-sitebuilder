import {
  RUNTIME_PING_TIMEOUT_MS,
  isRetryableDbError,
  withTimeout,
} from "./connection";

export type RuntimeLifecycleDeps<TDb> = {
  create: () => void;
  ping: () => Promise<void>;
  recycle: () => Promise<void>;
  getDb: () => TDb;
};

/**
 * Liveness + one retry around a stale postgres.js client.
 * Ping uses a client-side timeout; a timed-out client is always recycled
 * because Promise.race cannot cancel the underlying query.
 */
export function createRuntimeLifecycle<TDb>(deps: RuntimeLifecycleDeps<TDb>) {
  async function pingLiveClient(): Promise<void> {
    await withTimeout(
      deps.ping(),
      RUNTIME_PING_TIMEOUT_MS,
      "runtime db liveness ping",
    );
  }

  async function ensureLiveRuntimeClient(): Promise<void> {
    deps.create();
    try {
      await pingLiveClient();
    } catch {
      await deps.recycle();
      deps.create();
      await pingLiveClient();
    }
  }

  async function withRuntimeDb<T>(fn: (db: TDb) => Promise<T>): Promise<T> {
    await ensureLiveRuntimeClient();
    try {
      return await fn(deps.getDb());
    } catch (error) {
      if (!isRetryableDbError(error)) {
        throw error;
      }
      await deps.recycle();
      await ensureLiveRuntimeClient();
      return await fn(deps.getDb());
    }
  }

  return { ensureLiveRuntimeClient, withRuntimeDb };
}
