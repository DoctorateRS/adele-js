export interface PlayerDataDelta {
    playerDataDelta: {
        deleted: { [key: string]: object };
        modified: { [key: string]: object };
    };

    setDeleted(key: string, item: object): void;
    setModified(key: string, item: object): void;
}

export class StaticPlayerDataDelta implements PlayerDataDelta {
    playerDataDelta: { deleted: { [key: string]: object }; modified: { [key: string]: object } };

    constructor() {
        this.playerDataDelta = { modified: {}, deleted: {} };
    }

    setDeleted(key: string, item: object): void {
        this.playerDataDelta.deleted[key] = item;
    }

    setModified(key: string, item: object): void {
        this.playerDataDelta.modified[key] = item;
    }
}

export default PlayerDataDelta;
