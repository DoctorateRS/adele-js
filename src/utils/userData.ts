import json from "./json.ts";

export class UserDataManager {
    basePath: string;
    json = json;

    constructor(basePath?: string) {
        this.basePath = basePath ? basePath : "./res/user/";
    }

    readUserData() {
        return this.json.readJson(`${this.basePath}user.json`);
    }

    writeUserData(userData: object) {
        this.json.writeJson(userData, `${this.basePath}user.json`);
    }

    readSyncData() {
        return this.json.readJson(`${this.basePath}syncData.json`);
    }

    writeSyncData(syncData: object) {
        this.json.writeJson(syncData, `${this.basePath}syncData.json`);
    }

    readBattleReplayData() {
        return this.json.readJson(`${this.basePath}battleReplay.json`);
    }

    writeBattleReplayData(battleReplay: object) {
        this.json.writeJson(battleReplay, `${this.basePath}battleReplay.json`);
    }
}

const user = new UserDataManager();
export default user;
