import { Hono } from "hono";
import settings from "../config/config.json" with { type: "json" };
import asset from "./adele/assetbundle.ts";

const app = new Hono();

app.route("/assetbundle/official/Android/assets", asset);

app.all("/", (c) => {
    return c.text("Hello from Eyjafjalla!.");
});

app.notFound((c) => {
    const req = c.req;
    return c.text(`Unknown url : ${req.url}`, 404);
});

console.log(`Server is running on ${settings.server.host}:${settings.server.port}.`);
Deno.serve({ hostname: settings.server.host, port: settings.server.port }, app.fetch);
