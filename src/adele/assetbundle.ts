import { Hono } from "hono";
import { stream } from "hono/streaming";
import AssetsDownloader, { AssetsList } from "../utils/asset.ts";
const asset = new Hono();

const assetsList = new AssetsList();

asset.all("/:hash/:name", async (c) => {
    const { hash, name } = c.req.param();
    await Deno.mkdir(`./assets/${hash}/redirect/`, { recursive: true });

    assetsList.addEntry(hash, name);
    assetsList.update();

    const buf = await AssetsDownloader.downloadFile(
        new URL(`https://ak.hycdn.cn/assetbundle/official/Android/assets/${hash}/${name}`),
        `./assets/${hash}/redirect/${name}`,
    );

    return stream(c, async (stream) => {
        stream.onAbort(() => {
            console.warn(`Aborted Stream: { hash: ${hash}, name: ${name} }`);
        });

        await stream.write(buf);
    });
});

export default asset;
