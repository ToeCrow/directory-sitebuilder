import {
  INDEXNOW_DEFAULT_SITE_SLUG,
  getIndexNowUrlSnapshots,
} from "../src/lib/indexnow";

const siteSlug = process.argv[2] || INDEXNOW_DEFAULT_SITE_SLUG;

process.stdout.write(JSON.stringify(getIndexNowUrlSnapshots(siteSlug)));
