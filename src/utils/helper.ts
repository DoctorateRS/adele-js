export interface JsonUtilities {
    readJson(path: string): object;
    writeJson(path: string, object: object): void;
}

export class JsonUtils implements JsonUtilities {
    readJson(path: string): object {
        return JSON.parse(Deno.readTextFileSync(path));
    }
    writeJson(path: string, object: object): void {
        Deno.writeTextFileSync(path, JSON.stringify(object, undefined, 4));
    }
}

export default JsonUtils;
