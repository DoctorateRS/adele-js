import JsonUtils from "./json.ts";

export class UserData {
    userJsonPath: string;
    syncJsonPath: string;
    battleReplayPath: string;
    json = JsonUtils;

    constructor(userJsonPath?: string, syncJsonPath?: string, battleReplayPath?: string) {
        this.json = JsonUtils;
        this.userJsonPath = userJsonPath ? userJsonPath : "./resources/user/user.json";
        this.syncJsonPath = syncJsonPath ? syncJsonPath : "./resources/user/syncData.json";
        this.battleReplayPath = battleReplayPath ? battleReplayPath : "./resources/user/battleReplay.json";
    }

    readUserData() {
        return this.json.readJson(this.userJsonPath);
    }

    writeUserData(userData: object) {
        this.json.writeJson(this.userJsonPath, userData);
    }

    readSyncData() {
        return this.json.readJson(this.syncJsonPath);
    }

    writeSyncData(syncData: object) {
        this.json.writeJson(this.syncJsonPath, syncData);
    }

    readBattleReplayData() {
        return this.json.readJson(this.battleReplayPath);
    }

    writeBattleReplayData(battleReplay: object) {
        this.json.writeJson(this.battleReplayPath, battleReplay);
    }
}

const DefaultUserData = new UserData();
export default DefaultUserData;
