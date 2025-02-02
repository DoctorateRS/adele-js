const encoder = new TextEncoder();
const decoder = new TextDecoder();
export function writeJson(obj, path) {
    const file = Deno.createSync(path);
    file.writeSync(encoder.encode(JSON.stringify(obj, null, "    ")));
}
export function readJson(path) {
    const file = Deno.readFileSync(path);
    return JSON.parse(decoder.decode(file));
}
