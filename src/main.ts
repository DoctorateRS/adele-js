import { app } from "./app.ts";
import config from "./config/mod.ts";
import { updateConfig, updateExcel } from "./utils/update/mod.ts";

function runServer() {
    console.log(`Server is running on http://${config.server.host}:${config.server.host}`);
    Deno.serve({ hostname: config.server.host, port: config.server.port }, app.fetch);
}

if (config.assets.autoUpdate) {
    if (await updateConfig()) {
        await updateExcel();
    }

    runServer();
} else {
    runServer();
}
