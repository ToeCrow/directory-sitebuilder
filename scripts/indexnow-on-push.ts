/**
 * Compare content snapshots between HEAD and HEAD~1 for each IndexNow site.
 * Submit added, updated, and deleted sitemap URLs to IndexNow.
 *
 * Usage (CI or local):
 *   npx tsx scripts/indexnow-on-push.ts
 *
 * Requires INDEXNOW_KEY in the environment. Uses the same key for every site.
 */
import { execFileSync } from "node:child_process";
import { symlinkSync, rmSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  INDEXNOW_SITE_SLUGS,
  applyPublicTemplateFallback,
  diffIndexNowSnapshots,
  filterIndexNowSnapshotsForSite,
  getIndexNowUrlSnapshots,
  indexNowUrlsToSubmit,
  isPublicSiteTemplatePath,
  pageTemplateHasCopyChange,
  parseIndexNowSnapshotList,
  submitSiteToIndexNow,
  type IndexNowUrlSnapshot,
} from "../src/lib/indexnow";

function listSnapshotsAtDir(
  prevDir: string,
  siteSlug: string,
): IndexNowUrlSnapshot[] {
  const output = execFileSync(
    "npx",
    ["tsx", "scripts/list-indexnow-urls.ts", siteSlug],
    {
      cwd: prevDir,
      encoding: "utf8",
      env: process.env,
      shell: true,
      stdio: ["ignore", "pipe", "pipe"],
    },
  );

  return parseIndexNowSnapshotList(JSON.parse(output.trim()) as unknown);
}

function listSnapshotsBySiteAtRef(
  ref: string,
  siteSlugs: readonly string[],
): Record<string, IndexNowUrlSnapshot[]> {
  const root = process.cwd();
  const prevDir = join(tmpdir(), `indexnow-prev-${process.pid}`);
  const bySite: Record<string, IndexNowUrlSnapshot[]> = {};

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

    for (const siteSlug of siteSlugs) {
      bySite[siteSlug] = filterIndexNowSnapshotsForSite(
        listSnapshotsAtDir(prevDir, siteSlug),
        siteSlug,
      );
    }

    return bySite;
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

  let previousBySite: Record<string, IndexNowUrlSnapshot[]> = {};

  try {
    previousBySite = listSnapshotsBySiteAtRef("HEAD~1", INDEXNOW_SITE_SLUGS);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(
      `Could not load previous URL snapshots (${message}); treating all current URLs as new.`,
    );
    previousBySite = {};
  }

  const changedFiles = listChangedFiles("HEAD~1", "HEAD");
  const templateCopyFiles = listTemplateCopyChanges("HEAD~1", "HEAD", changedFiles);
  if (templateCopyFiles.length > 0) {
    console.log(
      "Public site templates changed — treating remaining current sitemap URLs as updated.",
    );
  }

  let submitted = 0;
  let failed = false;

  for (const siteSlug of INDEXNOW_SITE_SLUGS) {
    const current = getIndexNowUrlSnapshots(siteSlug);
    const previous = previousBySite[siteSlug] ?? [];
    let diff = diffIndexNowSnapshots(current, previous);
    diff = applyPublicTemplateFallback(
      diff,
      current.map((snapshot) => snapshot.url),
      templateCopyFiles,
    );

    const urlList = indexNowUrlsToSubmit(diff);
    if (urlList.length === 0) {
      console.log(
        `[${siteSlug}] No added, updated, or deleted sitemap URLs since HEAD~1 — skipping IndexNow.`,
      );
      continue;
    }

    console.log(`[${siteSlug}] Submitting ${urlList.length} URL(s) to IndexNow:`);
    for (const url of diff.added) {
      console.log(`  + ${url}`);
    }
    for (const url of diff.updated) {
      console.log(`  ~ ${url}`);
    }
    for (const url of diff.removed) {
      console.log(`  - ${url}`);
    }

    const result = await submitSiteToIndexNow(siteSlug, { urlList });
    submitted += result.urlCount;
    console.log(
      `[${siteSlug}] IndexNow response: status=${result.status} ok=${result.ok} body=${result.body || "(empty)"}`,
    );

    if (!result.ok) {
      failed = true;
    }
  }

  if (submitted === 0) {
    console.log(
      "No added, updated, or deleted sitemap URLs since HEAD~1 — skipping IndexNow.",
    );
  }

  if (failed) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
