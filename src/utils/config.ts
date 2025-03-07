import JsonUtils from "./json.ts";

export class ConfigManager {
    configBasePath: string;
    json = JsonUtils;

    constructor(configBasePath?: string) {
        this.configBasePath = configBasePath ? configBasePath : "./config/";
    }

    readConfig() {
        return this.json.readJson(this.configBasePath.concat("config.json"));
    }

    writeConfig(o: object) {
        this.json.writeJson(this.configBasePath.concat("config.json"), o);
    }

    readAssist() {
        return this.json.readJson(this.configBasePath.concat("assists.json"));
    }

    readVersionConfig() {
        return this.json.readJson(this.configBasePath.concat("version.json"));
    }

    readNetworkConfig() {
        return this.json.readJson(this.configBasePath.concat("network.json"));
    }
}

const DefaultConfigManager = new ConfigManager();
export default DefaultConfigManager;
