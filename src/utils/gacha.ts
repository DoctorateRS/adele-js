import json from "./json.ts";

export class Gacha {
    json = json;
    basePath: string;

    constructor(basePath: string = "./res/gacha/") {
        this.basePath = basePath;
    }

    normalGacha() {
        return this.json.readJson(this.basePath + "normal.json");
    }
}

const gachaPools = new Gacha();
export default gachaPools;
