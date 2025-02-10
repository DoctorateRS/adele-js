import JsonUtils, { JsonTools } from "./json.ts";

export class JsonDumper {
    basePath: "./dump";
    json: JsonTools;

    constructor() {
        this.json = JsonUtils;
    }

    dumpJson(object: object, extraIdent?: string) {
        if (extraIdent) this.json.writeJson(`${this.basePath}/${extraIdent}${Date.now()}.json`, object);
        else this.json.writeJson(`${this.basePath}/${Date.now()}.json`, object);
    }
}

const DefaultJsonDumper = new JsonDumper();
export default DefaultJsonDumper;
