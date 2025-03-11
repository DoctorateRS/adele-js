import { Context } from "hono";

export function prodRefreshConfig(c: Context) {
    return c.json({
        resVersion: null,
    });
}
