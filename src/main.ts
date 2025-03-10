import { app } from "./app.ts";
import { config } from "./config/mod.ts";

console.log(`Server is running on http://${config.server.host}:${config.server.host}`);
Deno.serve({ hostname: config.server.host, port: config.server.port }, app.fetch);
