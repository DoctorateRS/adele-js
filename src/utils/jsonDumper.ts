import JsonUtils from "./json.ts";

export class JsonDumper {
    basePath = "./dump";
    json = JsonUtils;

    constructor() {}

    dumpJson(object: object, extraIdent?: string) {
        extraIdent
            ? this.json.writeJson(`${this.basePath}/${extraIdent}${Date.now()}.json`, object)
            : this.json.writeJson(`${this.basePath}/${Date.now()}.json`, object);
    }
}

const DefaultJsonDumper = new JsonDumper();
export default DefaultJsonDumper;
