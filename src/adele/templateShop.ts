import { Hono } from "hono";

const templateShop = new Hono();

templateShop.post("/BuyGood", async (c) => {
    const req = await c.req.json();
    return c.json(req);
});

export default templateShop;
