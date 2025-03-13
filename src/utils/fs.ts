export class FsUtils {
    encoder = new TextEncoder();

    constructor() {}

    stripPath(path: string, pathSeperator?: string) {
        pathSeperator = pathSeperator ? pathSeperator : "/";
        let [stripped, cnt] = ["", 0];
        const frags = path.split(pathSeperator);

        for (const frag of frags) {
            cnt += 1;
            if (cnt !== frags.length) {
                stripped += `${frag}${pathSeperator}`;
            }
        }

        return stripped;
    }

    readFile(path: string) {
        return Deno.readFileSync(path);
    }

    readTextFile(path: string) {
        return Deno.readTextFileSync(path);
    }

    writeFile(path: string, data: Uint8Array) {
        const tmpPath = this.stripPath(path);
        Deno.mkdirSync(tmpPath, { recursive: true });
        Deno.createSync(path).writeSync(data);
    }

    writeTextFile(path: string, data: string) {
        this.writeFile(path, this.encoder.encode(data));
    }
}

const fs = new FsUtils();
export default fs;
