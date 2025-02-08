export interface FsSyncInterface {
    readFile(path: string): Uint8Array;
    readTextFile(path: string): string;
    writeFile(path: string, content: Uint8Array): void;
    writeTextFile(path: string, content: string): void;
}

export class FsSync implements FsSyncInterface {
    readFile(path: string): Uint8Array {
        return Deno.readFileSync(path);
    }

    readTextFile(path: string): string {
        return Deno.readTextFileSync(path);
    }

    writeFile(path: string, content: Uint8Array): void {
        Deno.writeFileSync(path, content, { create: true });
    }

    writeTextFile(path: string, content: string): void {
        Deno.writeTextFileSync(path, content, { create: true });
    }
}

const SyncFs = new FsSync();
export default SyncFs;
