import { create, extract } from "zip";
import json from "./json.ts";
import * as base64 from "base64";

type File = { name: string; data: Uint8Array };

class ZipFile {
    encrypt(file: File) {
        return create([{ name: file.name, data: file.data }]);
    }

    decrypt(file: Uint8Array) {
        return extract(file);
    }
}

const zip = new ZipFile();

export class BattleReplayUtilities {
    json = json;
    basePath: string;

    constructor(basePath: string = "./res/user/battleReplay.json") {
        this.basePath = basePath;
    }

    readBattleReplay() {
        return this.json.readJson(this.basePath);
    }

    writeBattleReplay(obj: object) {
        this.json.writeJson(obj, this.basePath);
    }
}

const utils = new BattleReplayUtilities();

export class BattleReplayManager {
    readonly encoder = new TextEncoder();
    decoder = new TextDecoder();
    json = json;
    zip = zip;
    base64 = base64;

    utils = utils;

    async encode(battleReplay: object) {
        const br = this.json.dumpJson(battleReplay, "");
        const bytes = await this.zip.encrypt({ name: "default_entry", data: this.encoder.encode(br) });
        return this.base64.encodeBase64(bytes);
    }

    async decode(battleReplay: string) {
        const compressedBytes = this.base64.decodeBase64(this.encoder.encode(battleReplay));
        const inst = (await this.zip.decrypt(compressedBytes)).find((v) => {
            return (v.name === "default_entry");
        });
        return this.json.parseJson(this.decoder.decode(inst.data));
    }
}

const battleReplay = new BattleReplayManager();
export default battleReplay;
