import json from "./json.ts";

export class BattleReplayManager {
    json = json;
    basePath: string;

    constructor(basePath?: string) {
        this.basePath = basePath ? basePath : "./res/user/battleReplay.json";
    }

    readBattleReplay() {
        return this.json.readJson(this.basePath);
    }

    writeBattleReplay(obj: object) {
        this.json.writeJson(obj, this.basePath);
    }
}

const battleReplay = new BattleReplayManager();
export default battleReplay;
