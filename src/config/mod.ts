import json from "../utils/json.ts";
import config from "./config.json" with { type: "json" };
export default config;
export const configPath = "./src/config/config.json";

type AdeleConfiguration = typeof config;

export class ConfigManager {
    json = json;
    path: string;

    constructor(path?: string) {
        this.path = path ? path : configPath;
    }

    readConfig() {
        return this.json.readJsonAs<AdeleConfiguration>(this.path);
    }

    writeConfig(cfg: AdeleConfiguration) {
        this.json.writeJson(cfg, this.path);
    }
}

export const configManager = new ConfigManager();
