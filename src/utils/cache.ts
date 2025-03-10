import json from "./json.ts";
import { NetworkConfigContent, VersionConfig } from "./update/types.ts";

export class CacheManager {
    basePath: string;
    json = json;

    constructor(basePath?: string) {
        this.basePath = basePath ? basePath : "./cache/";
    }

    writeCache(obj: object, cacheType: "version" | "network") {
        switch (cacheType) {
            case "version":
                this.json.writeJson(obj, `${this.basePath}version.json`);
                break;
            case "network":
                this.json.writeJson(obj, `${this.basePath}network.json`);
                break;
        }
    }

    readVersionCache() {
        return this.json.readJsonAs<VersionConfig>(`${this.basePath}version.json`);
    }

    readNetworkCacheContent() {
        return this.json.readJsonAs<{ sign: string; content: NetworkConfigContent }>(`${this.basePath}network.json`);
    }
}

const cache = new CacheManager();
export default cache;
