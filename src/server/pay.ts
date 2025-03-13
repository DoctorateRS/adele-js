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

export function queryPaymentConfig(c: Context) {
    return c.json({
        data: {
            payment: [
                {
                    key: "alipay",
                    recommend: true,
                    discount: false,
                },
                {
                    key: "wechat",
                    recommend: false,
                    discount: false,
                },
                {
                    key: "pcredit",
                    recommend: false,
                    discount: false,
                },
            ],
        },
        msg: "OK",
        status: 0,
        type: "A",
    });
}

export function alipay(c: Context) {
    return c.json({
        data: {
            orderId: "114514",
            extension: {
                qs: "app_id=2018091261385264&......&version=1.0",
            },
        },
        msg: "OK",
        status: 0,
        type: "A",
    });
}

export function wechat(c: Context) {
    return c.json({
        data: {
            orderId: "114514",
            extension: {
                appid: "wx0ae7fb63d830f7c1",
                noncestr: "5d7b4b7f6f6f6f6f6f6f6f6f6f6f6f",
                package: "Sign=WXPay",
                partnerid: "wx2018091261385264",
                prepayid: "wx2018091261385264",
                sign: "doctorate",
                timestamp: Date.now(),
            },
        },
        msg: "OK",
        status: 0,
        type: "A",
    });
}

export function state(c: Context) {
    return c.json({
        status: 101,
        msg: "支付成功",
        data: {
            endTime: Date.now() - 10,
            productList: [
                {
                    name: "开采一箱源石",
                    amount: 6480,
                    productCode: "CS_6_r1",
                    status: 1,
                },
            ],
        },
    });
}

export function check(c: Context) {
    return c.json({
        msg: "OK",
        status: 0,
        type: "A",
    });
}
