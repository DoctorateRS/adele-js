import { app } from "./app.ts";
import config from "./config/mod.ts";
import cache from "./utils/cache.ts";
import { updateConfig, updateExcel } from "./utils/update/mod.ts";

const lastUpdated = Date.now() - cache.readTimeCache().time;
if (config.assets.autoUpdate && (lastUpdated > 86400000)) {
    if (await updateConfig()) {
        await updateExcel();
    }
}

console.log(`Server is running on http://${config.server.host}:${config.server.port}`);
Deno.serve({ hostname: config.server.host, port: config.server.port }, app.fetch);
