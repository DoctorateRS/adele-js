import { Context } from "hono";
import user from "../utils/userData.ts";
import json from "../utils/json.ts";
import { getRandomNumber, getRandomUniqueElements } from "../utils/random.ts";
import { extractCharInstId } from "../utils/mod.ts";

const SkinIdSeperator = new RegExp("[@#]");

export function checkIn(c: Context) {
    return c.json({
        result: 0,
        playerDataDelta: {
            modified: {},
            deleted: {},
        },
    });
}

export async function changeSecretary(c: Context) {
    const { charInstId, skinId } = await c.req.json();
    const res = {
        playerDataDelta: {
            modified: {
                status: {
                    secretary: "",
                    secretarySkinId: "",
                },
            },
            deleted: {},
        },
    };

    if (typeof charInstId === "string" && typeof skinId === "string") {
        const secretaryId = skinId.split(SkinIdSeperator)[0];
        res.playerDataDelta.modified.status.secretary = secretaryId;
        res.playerDataDelta.modified.status.secretarySkinId = skinId;

        const syncData = user.readSyncData();
        syncData.user.status.secretary = secretaryId;
        syncData.user.status.secretarySkinId = skinId;
        user.writeSyncData(syncData);
    }

    return c.json(res);
}

export function login(c: Context) {
    return c.json({
        accessToken: "1",
        birth: null,
        channelId: "",
        isAuthenticate: true,
        isLatestUserAgreement: true,
        isMinor: false,
        needAuthenticate: false,
        result: 0,
        token: "abcd",
        yostar_username: "1234567890@123.com",
        yostar_uid: "1",
        uid: "10000023",
    });
}

export function oauthV2Grant(c: Context) {
    return c.json({
        data: {
            code: "abcd",
            uid: "10000023",
        },
        msg: "OK",
        status: 0,
    });
}

export function v1NeedCloudAuth(c: Context) {
    return c.json({
        msg: "OK",
        status: 0,
    });
}

export function v1GetToken(c: Context) {
    return c.json({
        channelUid: "1",
        error: "",
        extension: json.dumpJson({
            "isMinor": false,
            "isAuthenticate": true,
        }, 0),
        isGuest: 0,
        result: 0,
        token: "abcd",
        uid: "10000023",
    });
}

export function auth(c: Context) {
    return c.json({
        isAuthenticate: true,
        isGuest: false,
        isLatestUserAgreement: true,
        isMinor: false,
        needAuthenticate: false,
        uid: "10000023",
    });
}

export async function changeAvatar(c: Context) {
    const req = await c.req.json();

    const syncData = user.readSyncData();
    syncData.user.status.avatar = req;
    user.writeSyncData(syncData);

    return c.json({
        playerDataDelta: {
            deleted: {},
            modified: {
                status: {
                    avatar: req,
                },
            },
        },
    });
}

export async function appGetSettings(c: Context) {
    return c.json(await json.fetchJson("https://passport.arknights.global/app/getSettings"));
}

export async function appGetCode(c: Context) {
    return c.json(await json.fetchJson("https://passport.arknights.global/app/getCode"));
}

export function yostarCreateLogin(c: Context) {
    return c.json({
        isNew: 0,
        result: 0,
        token: "1",
        uid: "10000023",
        yostar_uid: "1",
        yostar_username: "1234567890@123.com",
    });
}

export function agreement(c: Context) {
    return c.json({
        data: [""],
        version: "4.0.0",
    });
}

export function authV1TokenByPhonePassword(c: Context) {
    return c.json({
        status: 0,
        msg: "OK",
        data: {
            token: "adele",
        },
    });
}

export function v1InfoBasic(c: Context) {
    return c.json({
        status: 0,
        msg: "OK",
        data: {
            hgId: "1",
            phone: "12345678901",
            email: "1234567890@123.com",
            identityNum: "10000023",
            identityName: "Adele",
            isMinor: false,
            isLatestUserAgreement: true,
        },
    });
}

export function oauth2V2Grant(c: Context) {
    return c.json({
        status: 0,
        msg: "OK",
        data: {
            code: "JieG",
            uid: "10000023",
        },
    });
}

export function appV1Config(c: Context) {
    return c.json({
        status: 0,
        msg: "OK",
        data: {
            antiAddiction: {
                minorPeriodEnd: 21,
                minorPeriodStart: 20,
            },
            payment: [
                {
                    key: "alipay",
                    recommend: true,
                },
                {
                    key: "wechat",
                    recommend: false,
                },
                {
                    key: "pcredit",
                    recommend: false,
                },
            ],
            customerServiceUrl: "https://chat.hypergryph.com/chat/h5/v2/index.html",
            cancelDeactivateUrl: "https://user.hypergryph.com/cancellation",
            agreementUrl: {
                game: "https://user.hypergryph.com/protocol/plain/ak/index",
                unbind: "https://user.hypergryph.com/protocol/plain/ak/cancellation",
                account: "https://user.hypergryph.com/protocol/plain/index",
                privacy: "https://user.hypergryph.com/protocol/plain/privacy",
                register: "https://user.hypergryph.com/protocol/plain/registration",
                updateOverview: "https://user.hypergryph.com/protocol/plain/overview_of_changes",
                childrenPrivacy: "https://user.hypergryph.com/protocol/plain/children_privacy",
            },
            app: {
                enablePayment: true,
                enableAutoLogin: false,
                enableAuthenticate: true,
                enableAntiAddiction: true,
                wechatAppId: "",
                alipayAppId: "",
                oneLoginAppId: "",
                enablePaidApp: false,
                appName: "明日方舟",
                appAmount: 600,
            },
        },
    });
}

export function generalV1ServerTime(c: Context) {
    return c.json({
        status: 0,
        msg: "OK",
        data: {
            serverTime: Date.now(),
            isHoliday: false,
        },
    });
}

export async function changeResume(c: Context) {
    const req = await c.req.json();

    return c.json({
        playerDataDelta: {
            modified: {
                status: {
                    resume: req.resume,
                },
            },
            deleted: {},
        },
    });
}

export async function getOtherPlayerNameCard(c: Context) {
    const req = await c.req.json();
    const userData = user.readUserData();

    const assistList = Object.keys(userData.user.troop.chars);
    const [op1, op2, op3] = getRandomUniqueElements(assistList, 3).map(parseInt);

    const [op1Inst, op2Inst, op3Inst] = [op1, op2, op3].map((v) => {
        return userData.user.troop.chars[v.toString()];
    });

    const nickNumber = getRandomNumber(10000);
    return c.json({
        nameCard: {
            nickName: "ABCDEFG",
            nickNumber: `${nickNumber}`,
            uid: req.uid,
            registerTs: 1700000000,
            mainStageProgress: null,
            charCnt: 0,
            skinCnt: 0,
            secretary: "char_002_amiya",
            secretarySkinId: "char_002_amiya#1",
            resume: "",
            teamV2: {},
            level: 200,
            avatarId: "0",
            avatar: {
                type: "ICON",
                id: "avatar_def_01",
            },
            assistCharList: [op1Inst, op2Inst, op3Inst],
            medalBoard: {
                type: "EMPTY",
                custom: null,
                template: null,
            },
            nameCardStyle: {
                componentOrder: [
                    "module_sign",
                    "module_assist",
                    "module_medal",
                ],
                skin: {
                    selected: "nc_rhodes_default",
                    state: {},
                },
                misc: {
                    showDetail: true,
                    showBirthday: false,
                },
            },
        },
    });
}

export async function bindBirthday(c: Context) {
    const req = await c.req.json();

    const syncData = user.readSyncData();
    const userData = user.readUserData();

    const bd = { month: -1, day: -1 };
    bd.month = req.month;
    bd.day = req.day;

    userData.user.status.birthday = bd;
    syncData.user.status.birthday = bd;

    user.writeUserData(userData);
    user.writeSyncData(syncData);

    return c.json({
        playerDataDelta: {
            modified: {
                user: {
                    status: {
                        birthday: bd,
                    },
                },
            },
            deleted: {},
        },
    });
}

export function agreementVersion(c: Context) {
    return c.json({
        status: 0,
        msg: "OK",
        data: {
            agreementUrl: {
                privacy: "https://user.hypergryph.com/protocol/plain/ak/privacy",
                service: "https://user.hypergryph.com/protocol/plain/ak/service",
                updateOverview: "https://user.hypergryph.com/protocol/plain/ak/overview_of_changes",
                childrenPrivacy: "https://user.hypergryph.com/protocol/plain/ak/children_privacy",
            },
            authorized: true,
            isLatestUserAgreement: true,
        },
    });
}
