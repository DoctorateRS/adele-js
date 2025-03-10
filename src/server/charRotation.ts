import { Context } from "hono";
import { configManager } from "../config/mod.ts";
import user from "../utils/userData.ts";

const secretarySearcher = new RegExp("^[^@#]+");

export async function setCurrent(c: Context) {
    const req = await c.req.json();
    const targetInstId = req.instId;

    const userData = user.readUserData();
    const syncData = user.readSyncData();

    userData.user.charRotation.current = targetInstId;
    syncData.user.charRotation.current = targetInstId;

    const profile = syncData.user.charRotation.preset[targetInstId].profile;
    const bg = syncData.user.charRotation.preset[targetInstId].background;
    const theme = syncData.user.charRotation.preset[targetInstId].homeTheme;

    let charId;
    for (const slot of syncData.user.charRotation.preset[targetInstId].slots) {
        if (slot.skinId === profile) {
            charId = slot.charId;
            break;
        }
    }

    userData.user.status.secretary = charId;
    syncData.user.status.secretary = charId;

    userData.user.status.secretarySkinId = profile;
    syncData.user.status.secretarySkinId = profile;

    userData.user.background.selected = bg;
    syncData.user.background.selected = bg;

    userData.user.homeTheme.selected = theme;
    syncData.user.homeTheme.selected = theme;

    user.writeUserData(userData);
    user.writeSyncData(syncData);

    return c.json({
        playerDataDelta: {
            modified: {
                charRotation: {
                    current: targetInstId,
                },
                status: {
                    secretary: charId,
                    secretarySkinId: profile,
                },
                background: {
                    selected: bg,
                },
                homeTheme: {
                    selected: theme,
                },
            },
            deleted: {},
        },
        pushMessage: [],
    });
}

export function createPreset(c: Context) {
    const syncData = user.readSyncData();
    const userData = user.readUserData();

    const charRotationData = syncData.user.charRotation;

    const defaultCharRotationData = {
        background: "bg_rhodes_day",
        homeTheme: "tm_rhodes_day",
        name: "unname",
        profile: "char_171_bldsk@witch#1",
        profileInst: "171",
        slots: [
            {
                "charId": "char_171_bldsk",
                "skinId": "char_171_bldsk@witch#1",
            },
        ],
    };

    const newId = charRotationData.preset.length + 1;

    charRotationData.preset[newId] = defaultCharRotationData;
    syncData.user.charRotation = charRotationData;
    userData.user.charRotation = charRotationData;

    user.writeSyncData(syncData);

    user.writeUserData(userData);

    return c.json({
        pushMessage: [],
        instId: 2,
        playerDataDelta: {
            modified: {
                charRotation: charRotationData,
            },
            deleted: {},
        },
    });
}

export async function deletePreset(c: Context) {
    const req = await c.req.json();
    const targetInstId = req.instId;

    const syncData = user.readSyncData();
    const userData = user.readUserData();

    syncData.user.charRotation.preset.delete(targetInstId);
    userData.user.charRotation.preset.delete(targetInstId);

    user.writeUserData(userData);
    user.writeSyncData(syncData);

    return c.json({
        playerDataDelta: {
            modified: {},
            deleted: {
                charRotation: {
                    preset: targetInstId,
                },
            },
        },
        pushMessage: [],
    });
}

export async function updatePreset(c: Context) {
    const req = await c.req.json();
    const instId = req.instId;

    const cfg = configManager.readConfig();
    const syncData = user.readSyncData();
    const userData = user.readUserData();

    const result = {
        playerDataDelta: {
            modified: {
                ["charRotation"]: syncData.user.charRotation,
            },
            deleted: {},
        },
        pushMessage: [],
        result: 0,
    };

    const presetData = syncData.user.charRotation.preset[instId];

    for (const [k, v] of Object.entries(req.data)) {
        if (v) presetData[k] = v;
    }

    if (req.data.background) {
        cfg.user = req.data.background;
        result.playerDataDelta.modified["background"] = { selected: req.data.background };
        syncData.user.background.selected = req.data.background;
    }

    if (req.data.homeTheme) {
        cfg.user.background = req.data.background;
        result.playerDataDelta.modified["homeTheme"] = { selected: req.data.homeTheme };
        syncData.user.background.homeTheme = req.data.homeTheme;
    }

    if (req.data.profile) {
        const secretary = secretarySearcher.exec(req.data.profile).join();

        cfg.user.secretary = secretary;
        cfg.user.secretarySkinId = req.data.profile;

        result.playerDataDelta.modified["status"] = {
            secretary: secretary,
            secretarySkinId: req.data.profile,
            profileInst: "",
        };

        result.playerDataDelta.modified["charRotation"].preset[instId].slots = req.data.slots;
        result.playerDataDelta.modified["charRotation"].profileInst = req.data.profileInst;

        syncData.user.status.secretary = secretary;
        syncData.user.status.secretarySkinId = req.data.profile;

        syncData.user.charRotation.preset[instId].slots = req.data.slots;
        syncData.user.charRotation.profileInst = req.data.profileInst;

        userData.user.charRotation = syncData.user.charRotation;
        user.writeUserData(userData);
    }

    user.writeSyncData(syncData);
    configManager.writeConfig(cfg);

    return c.json(result);
}
