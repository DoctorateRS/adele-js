import { Context } from "hono";
import shop from "../utils/shop.ts";
import { defaultPlayerDataDelta } from "../utils/mod.ts";

export async function getGoodList(c: Context) {
    const req = await c.req.json();
    const tmplShop = shop.templateShop();

    return c.json({
        data: tmplShop[req.shopId.toString()],
        nextSyncTime: -1,
        playerDataDelta: {
            modified: {},
            deleted: {},
        },
    });
}

export async function buyGood(c: Context) {
    try {
        return c.json(await c.req.json());
    } catch {
        return c.json(defaultPlayerDataDelta);
    }
}
