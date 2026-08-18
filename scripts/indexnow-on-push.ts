/**
 * Compare sitemap URLs for side-sleeper between HEAD and HEAD~1.
 * If new URLs appeared (new pages), submit only those to IndexNow.
 *
 * Usage (CI or local):
 *   npx tsx scripts/indexnow-on-push.ts
 *
 * Requires INDEXNOW_KEY in the environment.
 */
import { execFileSync } from "node:child_process";
import { symlinkSync, rmSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  INDEXNOW_DEFAULT_SITE_SLUG,
  diffNewIndexNowUrls,
  getIndexNowUrlList,
  submitSiteToIndexNow,
} from "../src/lib/indexnow";

function listUrlsAtRef(ref: string): string[] {
  const root = process.cwd();
  const prevDir = join(tmpdir(), `indexnow-prev-${process.pid}`);

  try {
    if (existsSync(prevDir)) {
      try {
        execFileSync("git", ["worktree", "remove", "--force", prevDir], {
          stdio: "pipe",
        });
      } catch {
        rmSync(prevDir, { recursive: true, force: true });
      }
    }

    execFileSync("git", ["worktree", "add", "--detach", prevDir, ref], {
      stdio: "pipe",
      cwd: root,
    });

    const nodeModules = join(root, "node_modules");
    const prevNodeModules = join(prevDir, "node_modules");
    if (existsSync(nodeModules) && !existsSync(prevNodeModules)) {
      symlinkSync(
        nodeModules,
        prevNodeModules,
        process.platform === "win32" ? "junction" : "dir",
      );
    }

    // Use a script file (not `tsx -e`) so shell quoting never breaks on CI.
    const output = execFileSync(
      "npx",
      ["tsx", "scripts/list-indexnow-urls.ts"],
      {
        cwd: prevDir,
        encoding: "utf8",
        env: process.env,
        shell: true,
        stdio: ["ignore", "pipe", "pipe"],
      },
    );

    return JSON.parse(output.trim()) as string[];
  } finally {
    try {
      execFileSync("git", ["worktree", "remove", "--force", prevDir], {
        stdio: "pipe",
        cwd: root,
      });
    } catch {
      rmSync(prevDir, { recursive: true, force: true });
    }
  }
}

async function main() {
  if (!process.env.INDEXNOW_KEY?.trim()) {
    console.error("INDEXNOW_KEY is required");
    process.exit(1);
  }

  const current = getIndexNowUrlList(INDEXNOW_DEFAULT_SITE_SLUG);
  let previous: string[] = [];

  try {
    previous = listUrlsAtRef("HEAD~1");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(
      `Could not load previous URL list (${message}); treating all current URLs as new.`,
    );
    previous = [];
  }

  const neu = diffNewIndexNowUrls(current, previous);

  if (neu.length === 0) {
    console.log("No new sitemap URLs since HEAD~1 — skipping IndexNow.");
    return;
  }

  console.log(`Submitting ${neu.length} new URL(s) to IndexNow:`);
  for (const url of neu) {
    console.log(`  ${url}`);
  }

  const result = await submitSiteToIndexNow(INDEXNOW_DEFAULT_SITE_SLUG, {
    urlList: neu,
  });

  console.log(
    `IndexNow response: status=${result.status} ok=${result.ok} body=${result.body || "(empty)"}`,
  );

  if (!result.ok) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
