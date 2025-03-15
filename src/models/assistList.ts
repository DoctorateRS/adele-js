import { random, randomString } from "../utils/random.ts";

export class Assister<T> {
    readonly uid: string;
    readonly aliasName: string;
    readonly nickName: string;
    readonly nickNumber: string;
    readonly level: number;
    readonly avatarId: string;
    readonly avatar: {
        type: string;
        id: string;
    };
    readonly lastOnlineTime: number;
    assistCharList: T[];
    readonly powerScore: number;
    readonly isFriend: boolean;
    readonly canRequestFriend: boolean;
    readonly assistSlotIndex: number;

    constructor() {
        this.uid = randomString.generateString(8, "Number");
        this.aliasName = "";
        this.nickName = randomString.generateString(random.getRandomNumber(12), "Full");
        this.nickNumber = randomString.generateString(4, "Number");
        this.level = 200;
        this.avatarId = "0";
        this.avatar = {
            type: "ASSISTANT",
            id: "char_421_crow#1",
        };
        this.lastOnlineTime = Date.now();
        this.assistCharList = [];
        this.powerScore = 500;
        this.isFriend = true;
        this.canRequestFriend = false;
        this.assistSlotIndex = 0;
    }
}
