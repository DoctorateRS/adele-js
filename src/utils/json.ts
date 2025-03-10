import fs from "./fs.ts";

export class JsonUtils {
    fs = fs;
    json = JSON;

    constructor() {}

    dumpJson(obj: object, space?: string | number) {
        return this.json.stringify(obj, null, space ? space : "    ");
    }

    async fetchJson(url: string | URL) {
        if (typeof url === "string") {
            return await (await fetch(new URL(url))).json();
        } else {
            return await (await fetch(url)).json();
        }
    }

    readJson(path: string | URL) {
        return this.json.parse(this.fs.readTextFile(path));
    }

    writeJson(obj: object, path: string | URL, space?: string | number) {
        this.fs.writeTextFile(path, this.dumpJson(obj, space));
    }
}

const json = new JsonUtils();
export default json;
