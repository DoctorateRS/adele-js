import { Hono } from "hono";
import settings from "../config/config.json" with { type: "json" };
import { assetbundle } from "./adele/assetbundle.js";

const app = new Hono();

app.route("/assetbundle/official/Android/assets", assetbundle);

Deno.serve({ hostname: settings.server.host, port: settings.server.port }, app.fetch);
