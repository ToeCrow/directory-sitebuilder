import { getIndexNowUrlSnapshots } from "../src/lib/indexnow";

process.stdout.write(JSON.stringify(getIndexNowUrlSnapshots("side-sleeper")));
