export * from "./fs.ts";
export * from "./json.ts";
export * from "./assets.ts";

export const defaultPlayerDataDelta = {
    playerDataDelta: {
        modified: {},
        deleted: {},
    },
};

export function getLastElement<T>(arr: T[]) {
    return arr[arr.length - 1];
}

export function extractCharInstId(charId: string) {
    console.log(charId);
    return parseInt(charId.split("_")[1]);
}
