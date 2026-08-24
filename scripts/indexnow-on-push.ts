/**
 * Compare content snapshots for side-sleeper between HEAD and HEAD~1.
 * Submit added, updated, and deleted sitemap URLs to IndexNow.
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
  applyPublicTemplateFallback,
  diffIndexNowSnapshots,
  getIndexNowUrlSnapshots,
  indexNowUrlsToSubmit,
  isPublicSiteTemplatePath,
  pageTemplateHasCopyChange,
  parseIndexNowSnapshotList,
  submitSiteToIndexNow,
  type IndexNowUrlSnapshot,
} from "../src/lib/indexnow";

function listSnapshotsAtRef(ref: string): IndexNowUrlSnapshot[] {
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

    return parseIndexNowSnapshotList(JSON.parse(output.trim()) as unknown);
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

function gitShow(ref: string, filePath: string): string | undefined {
  try {
    return execFileSync("git", ["show", `${ref}:${filePath}`], {
      encoding: "utf8",
      cwd: process.cwd(),
      stdio: ["ignore", "pipe", "pipe"],
    });
  } catch {
    return undefined;
  }
}

function listTemplateCopyChanges(fromRef: string, toRef: string, files: string[]): string[] {
  return files.filter((filePath) => {
    if (!isPublicSiteTemplatePath(filePath)) {
      return false;
    }
    return pageTemplateHasCopyChange(
      gitShow(fromRef, filePath),
      gitShow(toRef, filePath),
    );
  });
}

function listChangedFiles(fromRef: string, toRef: string): string[] {
  try {
    const output = execFileSync(
      "git",
      ["diff", "--name-only", fromRef, toRef],
      {
        encoding: "utf8",
        cwd: process.cwd(),
      },
    );
    return output
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);
  } catch {
    return [];
  }
}

async function main() {
  if (!process.env.INDEXNOW_KEY?.trim()) {
    console.error("INDEXNOW_KEY is required");
    process.exit(1);
  }

  const current = getIndexNowUrlSnapshots(INDEXNOW_DEFAULT_SITE_SLUG);
  let previous: IndexNowUrlSnapshot[] = [];

  try {
    previous = listSnapshotsAtRef("HEAD~1");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(
      `Could not load previous URL snapshots (${message}); treating all current URLs as new.`,
    );
    previous = [];
  }

  const changedFiles = listChangedFiles("HEAD~1", "HEAD");
  const templateCopyFiles = listTemplateCopyChanges("HEAD~1", "HEAD", changedFiles);
  let diff = diffIndexNowSnapshots(current, previous);
  diff = applyPublicTemplateFallback(
    diff,
    current.map((snapshot) => snapshot.url),
    templateCopyFiles,
  );

  if (templateCopyFiles.length > 0) {
    console.log(
      "Public site templates changed — treating remaining current sitemap URLs as updated.",
    );
  }

  const urlList = indexNowUrlsToSubmit(diff);

  if (urlList.length === 0) {
    console.log(
      "No added, updated, or deleted sitemap URLs since HEAD~1 — skipping IndexNow.",
    );
    return;
  }

  console.log(`Submitting ${urlList.length} URL(s) to IndexNow:`);
  for (const url of diff.added) {
    console.log(`  + ${url}`);
  }
  for (const url of diff.updated) {
    console.log(`  ~ ${url}`);
  }
  for (const url of diff.removed) {
    console.log(`  - ${url}`);
  }

  const result = await submitSiteToIndexNow(INDEXNOW_DEFAULT_SITE_SLUG, {
    urlList,
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
