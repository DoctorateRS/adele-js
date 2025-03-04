import { FsSync } from "./fs.ts";
import JsonUtils from "./json.ts";

export class AssetsDownloaderClass {
    fs: FsSync;

    constructor() {
        this.fs = new FsSync();
    }

    async downloadFile(url: URL, path: string): Promise<Uint8Array> {
        const req = await fetch(url);
        const file = await Deno.open(path, { create: true, write: true });

        const buf = new Uint8Array(await req.arrayBuffer());
        await file.write(buf);

        return buf;
    }
}

const AssetsDownloader = new AssetsDownloaderClass();

export class AssetsList {
    assets: { [key: string]: string[] };

    constructor() {
        try {
            const assets = JsonUtils.readJsonAs<{ [key: string]: string[] }>("./assets/assetsList.json");
            this.assets = assets;
        } catch {
            this.assets = {};
        }
    }

    addEntry(hash: string, name?: string) {
        if (this.assets[hash]) {
            if (name) {
                this.assets[hash].push(name);
            }
        } else {
            this.assets[hash] = [];
        }
    }

    clear() {
        this.assets = {};
    }

    update() {
        JsonUtils.writeJson("./assets/assetsList.json", this.assets);
    }
}

const AssetsLists = new AssetsList();

export default [AssetsDownloader, AssetsLists];
