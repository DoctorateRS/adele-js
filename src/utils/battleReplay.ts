import { decodeBase64, encodeBase64 } from "base64";
import { create, extract } from "zip";
import SyncFs from "./fs.ts";

export class BattleReplayUtils {
    basePath: string;
    fs = SyncFs;
    encoder = new TextEncoder();
    decoder = new TextDecoder();

    constructor(basePath?: string) {
        basePath ? this.basePath = basePath : this.basePath = "./resources/user/batteReplay.json";
    }

    async loadBattleReplayFromFile(): Promise<object> {
        return await this.decrypt(this.fs.readTextFile(this.basePath));
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
