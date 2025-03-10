import json from "../utils/json.ts";
import config from "./config.json" with { type: "json" };
export default config;
export const configPath = "./src/config/config.json";

export class ConfigManager {
    json = json;
    path: string;

    constructor(path?: string) {
        this.path = path ? path : configPath;
    }

    readConfig() {
        return this.json.readJson(this.path);
    }

    writeConfig(cfg: typeof config) {
        this.json.writeJson(cfg, this.path);
    }
}

export const configManager = new ConfigManager();
