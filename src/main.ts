import { assetsConfig, serverConfig } from "./settings.ts";
import app from "./app.ts";
import updateConfig from "./utils/update/updateConfig.ts";
import updateExcel from "./utils/update/updateExcel.ts";

if (assetsConfig.autoUpdate && !serverConfig.enableServer) {
    if (await updateConfig()) await updateExcel();
}

console.log(`Server is running on ${serverConfig.host}:${serverConfig.port}`);
Deno.serve({ hostname: serverConfig.host, port: serverConfig.port }, app.fetch);
