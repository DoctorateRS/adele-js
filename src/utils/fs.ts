export class FsUtils {
    pathSeperator: string;
    encoder = new TextEncoder();

    constructor(pathSeperator?: string) {
        this.pathSeperator = pathSeperator ? pathSeperator : "/";
    }

    stripPath(path: string) {
        let [stripped, cnt] = ["", 0];
        const frags = path.split(this.pathSeperator);

        for (const frag of frags) {
            cnt += 1;
            if (cnt !== frags.length) {
                stripped += `${frag}${this.pathSeperator}`;
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
