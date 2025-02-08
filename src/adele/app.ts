import { Hono } from "hono";
import { logger } from "hono/logger";
import log from "../utils/logging.ts";
import asset from "./assetbundle.ts";

const app = new Hono();

app.use(logger(log));

app.route("/assetbundle/official/Android/assets", asset);

app.notFound((c) => {
    return c.json({
        playerDataDelta: {
            deleted: {},
            modified: {},
        },
    });
});

export default app;
