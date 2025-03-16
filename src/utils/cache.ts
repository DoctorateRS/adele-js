import json from "./json.ts";
import { NetworkConfigContent, VersionConfig } from "./update/types.ts";

export class CacheManager {
    basePath: string;
    json = json;

    constructor(basePath: string = "./cache/") {
        this.basePath = basePath;
    }

    writeCache(obj: object, cacheType: "version" | "network" | "time") {
        switch (cacheType) {
            case "version":
                this.json.writeJson(obj, `${this.basePath}version.json`);
                break;
            case "network":
                this.json.writeJson(obj, `${this.basePath}network.json`);
                break;
            case "time":
                this.json.writeJson(obj, `${this.basePath}time.json`);
                break;
        }
    }

    readTimeCache() {
        return this.json.readJsonAs<{ time: number }>(`${this.basePath}time.json`);
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
