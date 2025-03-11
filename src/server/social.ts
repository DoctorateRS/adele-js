import { Context } from "hono";
import { defaultPlayerDataDelta, getLastElement } from "../utils/mod.ts";
import user from "../utils/userData.ts";
import { configManager } from "../config/mod.ts";

export async function setAssistCharList(c: Context) {
    interface Char {
        charInstId: number;
        skillIndex: number;
    }

    try {
        const req = await c.req.json();
        const char = getLastElement<Char>(req.assistCharList);

        const userData = user.readUserData();
        const cfg = configManager.readConfig();

        cfg.char.assistUnit = {
            charId: userData.user.troop.chars[char.charInstId.toString()].charId,
            skinId: userData.user.troop.chars[char.charInstId.toString()].skin,
            skillIndex: char.skillIndex,
        };

        configManager.writeConfig(cfg);

        return c.json({
            playerDataDelta: {
                deleted: {},
                modified: { social: { assistCharList: req.assistCharList } },
            },
        });
    } catch {
        return c.json(defaultPlayerDataDelta);
    }
}

export function getSortListInfo(c: Context) {
    return c.json({
        result: [],
        playerDataDelta: {
            deleted: {},
            modified: {},
        },
    });
}

export function getFriendList(c: Context) {
    return c.json(defaultPlayerDataDelta);
}

export function searchPlayer(c: Context) {
    return c.json({ list: [], request: [] });
}

export function getFriendRequestList(c: Context) {
    return c.json(defaultPlayerDataDelta);
}

export function processFriendRequest(c: Context) {
    return c.json(defaultPlayerDataDelta);
}

export function sendFriendRequest(c: Context) {
    return c.json(defaultPlayerDataDelta);
}

export function setFriendAlias(c: Context) {
    return c.json(defaultPlayerDataDelta);
}

export function deleteFriend(c: Context) {
    return c.json(defaultPlayerDataDelta);
}

export async function setCardShowMedal(c: Context) {
    const req = await c.req.json();
    const userData = user.readUserData();

    if (Object.hasOwn(userData.user.social, "medalBoard")) {
        userData.user.social.medalBoard = {};
    }

    userData.user.social.medalBoard.type = req.type;
    userData.user.social.medalBoard.template = req.templateGroup;
    user.writeUserData(userData);

    return c.json({
        playerDataDelta: {
            modified: {
                social: {
                    medalBoard: {
                        type: req.type,
                        template: req.templateGroup,
                    },
                },
            },
            deleted: {},
        },
    });
}
