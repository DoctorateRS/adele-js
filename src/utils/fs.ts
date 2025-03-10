export class FsUtils {
    encoder = new TextEncoder();
    decoder = new TextDecoder();

    constructor() {}

    readFile(path: string | URL) {
        return Deno.readFileSync(path);
    }

    readTextFile(path: string | URL) {
        return Deno.readTextFileSync(path);
    }

    writeFile(path: string | URL, data: Uint8Array, opts?: Deno.WriteFileOptions) {
        Deno.writeFileSync(path, data, opts);
    }

    writeTextFile(path: string | URL, data: string, opts?: Deno.WriteFileOptions) {
        Deno.writeTextFileSync(path, data, opts ? opts : { create: true });
    }
}

const fs = new FsUtils();
export default fs;
