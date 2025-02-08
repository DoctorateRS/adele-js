import { FsSync } from "./fs.ts";
import JsonUtils from "./json.ts";

export class AssetDownloader {
    fs: FsSync;

    constructor() {
        this.fs = new FsSync();
    }

    async downloadFile(url: URL, path: string): Promise<void> {
        const req = await fetch(url);
        const file = await Deno.open(path, { create: true, write: true });

        const buf = new Uint8Array(await req.arrayBuffer());
        await file.write(buf);
    }
}

const Dl = new AssetDownloader();
export default Dl;

export class AssetsList {
    assets: { [key: string]: string[] };

    constructor() {
        this.assets = {};

        for (const [hash, names] of Object.entries(JsonUtils.readJson("./assets/assetsList.json"))) {
            this.assets[hash] = names;
        }
    }

    addEntry(hash: string, name?: string): void {
        if (name !== undefined) {
            const entries = this.assets[hash];
            if (entries === undefined) {
                this.assets[hash] = [name];
            } else {
                entries.push(name);
                this.assets[hash] = entries;
            }
        } else {
            this.assets[hash] = [];
        }
    }

    clear(): void {
        this.assets = {};
    }

    update(): void {
        JsonUtils.writeJson("./assets/assetsList.json", this.assets);
    }
}
