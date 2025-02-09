import { assetsConfig, serverConfig } from "./settings.ts";
import app from "./adele/application.ts";
import updateConfig from "./utils/update/updateConfig.ts";
import updateExcel from "./utils/update/updateExcel.ts";

// FOR DEBUG PURPOSE
const override = true;

if (assetsConfig.autoUpdate && !override) {
    if (await updateConfig()) await updateExcel();
}

console.log(`Server is running on ${serverConfig.host}:${serverConfig.port}`);
Deno.serve({ hostname: serverConfig.host, port: serverConfig.port }, app.fetch);
