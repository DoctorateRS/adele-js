import { Context } from "hono";
import { defaultPlayerDataDelta } from "../utils/mod.ts";
import user from "../utils/userData.ts";

export async function setAssistCharList(c: Context) {
    try {
        const req = await c.req.json();

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
