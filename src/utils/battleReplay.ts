import { decodeBase64, encodeBase64 } from "base64";
import { create, extract } from "zip";
import JsonUtils from "./json.ts";

export class BattleReplayUtils {
    basePath: string;
    json = JsonUtils;
    encoder = new TextEncoder();
    decoder = new TextDecoder();

    constructor(basePath?: string) {
        basePath ? this.basePath = basePath : this.basePath = "./resources/user/batteReplay.json";
    }

    loadBattleReplayFromFile(): object {
        return this.json.readJson(this.basePath);
    }

    async decrypt(source: string): Promise<object> {
        const decodedData = decodeBase64(this.encoder.encode(source));

        for (const { name, data } of await extract(decodedData)) {
            if (name === "default_entry") {
                return JSON.parse(this.decoder.decode(data));
            }
        }

        return {};
    }

    async encrypt(data: string | object): Promise<string> {
        if (typeof data === "string") {
            const buf = await create([{ name: "default_entry", data: this.encoder.encode(data) }]);
            return encodeBase64(buf);
        } else {
            const buf = await create([{ name: "default_entry", data: this.encoder.encode(JSON.stringify(data)) }]);
            return encodeBase64(buf);
        }
    }
}

const BattleReplayUtilities = new BattleReplayUtils();
export default BattleReplayUtilities;
