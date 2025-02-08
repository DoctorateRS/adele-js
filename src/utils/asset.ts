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
    assets: Map<string, string[]>;

    constructor() {
        this.assets = JsonUtils.readJson("./assets/assetsList.json");
    }

    addEntry(hash: string, name: string): void {
        const entries = this.assets.get(hash);
        if (entries === undefined) {
            this.assets.set(hash, [name]);
        } else {
            entries.push(name);
            this.assets.set(hash, entries);
        }
    }

    update(): void {
        JsonUtils.writeJson("./assets/assetsList.json", this.assets);
    }
}
