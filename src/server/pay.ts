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

export function queryShowAppProduct(c: Context) {
    return c.json({
        data: {
            amount: 114514,
            productName: "开采一箱源石",
        },
        isBox: false,
        msg: "OK",
        type: "A",
        status: 0,
    });
}
