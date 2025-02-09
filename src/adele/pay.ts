import { Hono } from "hono";

const pay = new Hono();

interface CreateOrderInterface {
    goodId: string;
}

pay.post("/getUnconfirmedOrderIdList", (c) => {
    return c.json({
        orderIdList: [],
        playerDataDelta: { modified: {}, deleted: {} },
    });
});

pay.post("/createOrder", async (c) => {
    const req = await c.req.json<CreateOrderInterface>();
    return c.json({
        orderId: req.goodId,
        orderIdList: [],
        playerDataDelta: { modified: {}, deleted: {} },
    });
});

pay.post("/createOrderAlipay2", async (c) => {
    const req = await c.req.json<CreateOrderInterface>();
    return c.json({
        result: 0,
        orderId: req.goodId,
        price: 600,
        qs: "",
        pagePay: true,
        returnUrl: "",
        playerDataDelta: { modified: {}, deleted: {} },
    });
});

// REFERENCE: https://github.com/Shiiyuko/Arkdays/blob/main/src/main/java/com/hypergryph/arknights/game/pay.java
pay.post("/confirmOrder", async (c) => {
    // const headerSecret = c.req.header("secret");
    // const reqJson = await c.req.json();
    return c.json({});
});

pay.post("/confirmOrderAlipay", (c) => {
    return c.json({ status: 0 });
});

export default pay;
