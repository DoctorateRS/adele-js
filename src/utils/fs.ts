export class FsSync {
    readFile(path: string): Uint8Array {
        return Deno.readFileSync(path);
    }

    readTextFile(path: string): string {
        return Deno.readTextFileSync(path);
    }

    writeFile(path: string, content: Uint8Array, options?: Deno.WriteFileOptions): void {
        options ? Deno.writeFileSync(path, content, options) : Deno.writeFileSync(path, content, { create: true });
    }

    writeTextFile(path: string, content: string, options?: Deno.WriteFileOptions): void {
        options ? Deno.writeTextFileSync(path, content, options) : Deno.writeTextFileSync(path, content, { create: true });
    }
}

const SyncFs = new FsSync();
export default SyncFs;
