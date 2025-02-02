import settings from "../config/config.json" with { type: "json" };

import { Application } from "oak";
import { updateExcel } from "./utils/updateExcel.ts";

const app = new Application();

if (settings.assets.autoUpdate) {
    await updateExcel();
}

app.listen({
    hostname: settings.server.host,
    port: settings.server.port,
});
