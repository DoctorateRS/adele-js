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

    readJson(path: string): object {
        return JSON.parse(this.fs.readTextFile(path));
    }

    writeJson(path: string, object: object): void {
        this.fs.writeTextFile(path, JSON.stringify(object, undefined, 4));
    }
}

const JsonUtils = new JsonTools();
export default JsonUtils;
