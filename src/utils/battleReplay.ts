import { decodeBase64 } from "base64";
import { extract } from "zip";

export class BattleReplayUtils {
    encoder: TextEncoder;
    decoder: TextDecoder;
    constructor() {
        this.encoder = new TextEncoder();
        this.decoder = new TextDecoder();
    }

    async decrypt(data: string) {
        const decodedData = decodeBase64(this.encoder.encode(data));
        for (const zipReader of await extract(decodedData)) {
            if (zipReader.name === "*")
        }
    }
}
