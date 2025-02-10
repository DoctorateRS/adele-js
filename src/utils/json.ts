import { FsSync } from "./fs.ts";

export interface JsonUtilities {
    fs: FsSync;
    readJson(path: string): object;
    writeJson(path: string, object: object): void;
    fetchJson(url: string | URL): Promise<object>;

    readJsonAs<T>(path: string): T;
    fetchJsonAs<T>(url: string | URL): Promise<T>;

    stringifyJson(object: object): string;
}

export class JsonTools implements JsonUtilities {
    fs: FsSync;

    constructor() {
        this.fs = new FsSync();
    }

    readJson(path: string): object {
        return JSON.parse(this.fs.readTextFile(path));
    }

    writeJson(path: string, object: object): void {
        this.fs.writeTextFile(path, JSON.stringify(object, undefined, 4));
    }

    async fetchJson(url: string | URL): Promise<object> {
        const req = await fetch(url);
        return JSON.parse(await req.text());
    }

    readJsonAs<T>(path: string): T {
        return JSON.parse(this.fs.readTextFile(path));
    }

    async fetchJsonAs<T>(url: string | URL): Promise<T> {
        const req = await fetch(url);
        return JSON.parse(await req.text());
    }

    stringifyJson(object: object): string {
        return JSON.stringify(object, undefined, 4);
    }
}

const JsonUtils = new JsonTools();
export default JsonUtils;
