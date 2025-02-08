import { Hono } from "hono";
import { AssetsList } from "../utils/asset.ts";
const asset = new Hono();

const assetsList = new AssetsList();

asset.all("/:hash/:name", async (c) => {
    const { hash, name } = c.req.param();
    await Deno.mkdir(`./assets/${hash}/redirect/`, { recursive: true });

    assetsList.addEntry(name, hash);
    assetsList.update();

    return c.text(`Assets test ${hash}/${name}/`);
});

export default asset;
