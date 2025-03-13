export class FsUtils {
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

    writeFile(path: string, data: Uint8Array, opts?: Deno.WriteFileOptions) {
        Deno.createSync(path);
        Deno.writeFileSync(path, data, opts);
    }

    writeTextFile(path: string, data: string, opts?: Deno.WriteFileOptions) {
        Deno.createSync(path);
        Deno.writeTextFileSync(path, data, opts ? opts : { create: true });
    }
}

const fs = new FsUtils();
export default fs;
