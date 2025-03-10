import fs from "./fs.ts";
import json from "./json.ts";

export class AssetDownloader {
    basePath: string;
    fs = fs;

    constructor(basePath?: string) {
        this.basePath = basePath ? basePath : "./assets/";
    }

    async downloadAsset(url: URL | string, asset: { hash: string; name: string }) {
        let req: Response;
        if (typeof url === "string") {
            req = await fetch(new URL(url));
        } else {
            req = await fetch(url);
        }

        const buf = new Uint8Array(await req.arrayBuffer());
        this.fs.writeFile(this.basePath + asset.hash + "/redirect/" + asset.name, buf, { create: true });
        return buf;
    }
}

export class AssetsList {
    path: string;
    inner: { [key: string]: string[] };
    json = json;

    constructor(basePath?: string) {
        this.path = basePath ? basePath : "./assets/assets.json";

        try {
            this.inner = this.json.readJson(this.path);
        } catch (e) {
            console.warn(e);
            this.inner = {};
        }
    }

    updateIndex(hash: string, name: string) {
        if (!Object.hasOwn(this.inner, hash)) {
            this.inner[hash] = [];
        }

        this.inner[hash].push(name);
    }

    writeIndex() {
        this.json.writeJson(this.inner, this.path);
    }
}

export const assetDownloader = new AssetDownloader();
export const assetsList = new AssetsList();
