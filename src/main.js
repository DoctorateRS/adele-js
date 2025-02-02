import settings from "../config/config.json" with { type: "json" };

import { Application } from "oak";
const app = new Application();

app.listen({
    hostname: settings.server.host,
    port: settings.server.port,
});
