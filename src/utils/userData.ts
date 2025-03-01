import JsonUtils from "./json.ts";

export class UserData {
    userJsonPath: string;
    syncJsonPath: string;
    json = JsonUtils;

    constructor(userJsonPath?: string, syncJsonPath?: string) {
        this.json = JsonUtils;
        this.userJsonPath = userJsonPath ? userJsonPath : "./resources/user/user.json";
        this.syncJsonPath = syncJsonPath ? syncJsonPath : "./resources/user/syncData.json";
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
}

const DefaultUserData = new UserData();
export default DefaultUserData;
