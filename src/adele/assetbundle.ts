import { Hono } from "hono";
import JsonUtils from "../utils/helper.ts";
const asset = new Hono();

asset.all("/:res/:asset", async (c) => {
    const { res, asset } = c.req.param();
    await Deno.mkdir(`./assets/${asset}/redirect/`, { recursive: true });

    return c.text(`Assets test ${res}/${asset}/`);
});

export default asset;
