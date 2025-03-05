export type Value = number | string | object | Value[];

export interface PlayerDataDelta {
    playerDataDelta: {
        deleted: { [key: string]: Value };
        modified: { [key: string]: Value };
    };

    setDeleted(key: string, item: Value): this;
    setModified(key: string, item: Value): this;
}

export class StaticPlayerDataDelta implements PlayerDataDelta {
    playerDataDelta: { deleted: { [key: string]: Value }; modified: { [key: string]: Value } };

    constructor() {
        this.playerDataDelta = { modified: {}, deleted: {} };
    }

    setDeleted(key: string, item: Value): this {
        this.playerDataDelta.deleted[key] = item;
        return this;
    }

    setModified(key: string, item: Value): this {
        this.playerDataDelta.modified[key] = item;
        return this;
    }
}

export default PlayerDataDelta;
