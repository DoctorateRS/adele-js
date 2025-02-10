import JsonUtils, { JsonTools } from "./json.ts";

export class UserData {
    userJsonPath: string;
    json: JsonTools;
    constructor(userJsonPath?: string) {
        this.json = JsonUtils;
        this.userJsonPath = "./resources/user/user.json";

        if (userJsonPath) this.userJsonPath = userJsonPath;
    }

    readUserData() {
        return this.json.readJson(this.userJsonPath);
    }

    writeUserData(userData: object) {
        this.json.writeJson(this.userJsonPath, userData);
    }
}

const DefaultUserData = new UserData();
export default DefaultUserData;
