import { stream } from "hono/streaming";
import { assetDownloader, assetsList } from "../utils/assets.ts";
import { Context } from "hono";

export async function downloadAsset(c: Context) {
    const { hash, name } = c.req.param();
    Deno.mkdirSync(`./assets/${hash}/redirect/`, { recursive: true });

    assetsList.updateIndex(hash, name);
    assetsList.writeIndex();

    const url = `https://ak.hycdn.cn/assetbundle/official/Android/assets/${hash}/${name}`;
    const buf = await assetDownloader.downloadAsset(url, { hash, name });

    return stream(c, async (stream) => {
        stream.onAbort(() => {
            console.warn(`Aborted Stream: { hash: ${hash}, name: ${name} }`);
        });
        await stream.write(buf);
    });
}
