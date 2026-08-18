import { getIndexNowUrlList } from "../src/lib/indexnow";

process.stdout.write(JSON.stringify(getIndexNowUrlList("side-sleeper")));
