import { FsSync } from "./fs.ts";

export interface JsonUtilities {
    fs: FsSync;
    readJson(path: string): object;
    writeJson(path: string, object: object): void;
}

export class JsonTools implements JsonUtilities {
    fs: FsSync;

    constructor() {
        this.fs = new FsSync();
    }

    readJson<T>(path: string): T {
        return JSON.parse(this.fs.readTextFile(path));
    }

    writeJson<T>(path: string, object: T): void {
        this.fs.writeTextFile(path, JSON.stringify(object, undefined, 4));
    }
}

const JsonUtils = new JsonTools();
export default JsonUtils;
