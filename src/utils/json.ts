import { Context } from "hono";
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

    async fetchJsonAs<T>(url: string | URL): Promise<T> {
        return await this.fetchJson(url);
    }

    readJson(path: string | URL) {
        return this.json.parse(this.fs.readTextFile(path));
    }

    readJsonAs<T>(path: string | URL): T {
        return this.json.parse(this.fs.readTextFile(path));
    }

    writeJson(obj: object, path: string | URL, space?: string | number) {
        this.fs.writeTextFile(path, this.dumpJson(obj, space));
    }
}

const json = new JsonUtils();
export default json;

export class JsonDumper {
    json = json;
    basePath: string;

    constructor(basePath?: string) {
        this.basePath = basePath ? basePath : "./dump";
    }

    async dumpJson(c: Context) {
        const obj = await c.req.json();
        const time = Date.now();
        const url = c.req.path;

        this.json.writeJson(obj, `${this.basePath}${url}/${time}.json`);
    }
}
