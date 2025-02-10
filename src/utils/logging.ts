import { createMiddleware } from "hono/factory";
import SyncFs, { FsSync } from "./fs.ts";
import JsonUtils from "./json.ts";

function log(message: string, ...rest: string[]) {
    if (message.startsWith("<--")) {
        console.log(message.substring(4), ...rest);
    }
}

export default log;

export class AdeleLoggerService {
    encoder: TextEncoder;
    fileInst: Deno.FsFile;
    dumpTo: string;

    constructor(dumpTo?: string) {
        this.dumpTo = dumpTo ? dumpTo : "./dump/dump.log";
        this.encoder = new TextEncoder();
        this.fileInst = Deno.openSync(this.dumpTo, { write: true, truncate: false });
    }

    write(content: string) {
        this.fileInst.writeSync(this.encoder.encode(content));
    }

    writeLf() {
        this.write("\n");
    }

    writeLn(content: string) {
        this.write(content);
        this.writeLf();
    }

    dump(url: string, object: object) {
        this.writeLn(url);
        this.writeLn(JsonUtils.stringifyJson(object));
    }
}

const DefaultAdeleLoggerServiceInst = new AdeleLoggerService();

export const adeleLogger = createMiddleware(async (c, next) => {
    const { url } = c.req;
    const path = url.slice(url.indexOf("/", 8));

    try {
        const jsonReq = await c.req.json();
        if (jsonReq) DefaultAdeleLoggerServiceInst.dump(path, jsonReq);
    } catch {
        DefaultAdeleLoggerServiceInst.writeLn(path);
        DefaultAdeleLoggerServiceInst.writeLn("No JSON Data to dump.");
    }

    await next();
});
