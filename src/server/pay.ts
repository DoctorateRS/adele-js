import { Context } from "hono";
import shop from "../utils/shop.ts";

export function getUnconfirmedOrderIdList(c: Context) {
    return c.json({
        orderIdList: [],
        playerDataDelta: {
            deleted: {},
            modified: {},
        },
    });
}

export function getAllProductList(c: Context) {
    return c.json(shop.allProductList());
}

export async function getCreateOrder(c: Context) {
    const { goodId } = await c.req.json();
    return c.json({
        result: 0,
        orderId: goodId,
        orderIdList: [],
        playerDataDelta: {
            modified: {},
            deleted: {},
        },
    });
}
