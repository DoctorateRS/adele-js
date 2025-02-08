import { assetsConfig, serverConfig } from "./settings.ts";
import app from "./adele/app.ts";
import updateExcel from "./utils/updateExcel.ts";

if (assetsConfig.autoUpdate) {
    await updateExcel();
}

console.log(`Server is running on ${serverConfig.host}:${serverConfig.port}`);
Deno.serve({ hostname: serverConfig.host, port: serverConfig.port }, app.fetch);
