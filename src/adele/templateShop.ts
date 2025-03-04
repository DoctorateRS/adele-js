import { Hono } from "hono";

const templateShop = new Hono();

templateShop.post("/BuyGood", async (c) => {
    return c.json(await c.req.json());
});

export default templateShop;
