import { Context } from "hono";
import user from "../utils/userData.ts";

export function charBuildBatchSetCharVoiceLan(c: Context) {
    return c.json({
        result: {},
        playerDataDelta: {
            modified: {},
            deleted: {},
        },
    });
}

export async function charBuildaddonStoryUnlock(c: Context) {
    const req = await c.req.json();
    const ts = { fts: Date.now(), rts: Date.now() };

    const data = {
        playerDataDelta: {
            deleted: {},
            modified: {
                troop: {
                    addon: {},
                },
            },
        },
    };

    const savedUserData = user.readUserData();

    savedUserData.user.troop.addon[req.storyId] = { story: { [req.storyId]: ts } };
    data.playerDataDelta.modified.troop.addon[req.storyId] = { story: { [req.storyId]: ts } };

    user.writeUserData(savedUserData);
    return c.json(data);
}

export async function charBuildSetCharVoiceLan(c: Context) {
    const req = await c.req.json();

    const data = {
        playerDataDelta: {
            deleted: {},
            modified: {
                troop: {
                    chars: {},
                },
            },
        },
    };

    const savedUserData = user.readUserData();
    for (const character of Object.values(req.charList)) {
        savedUserData.user.troop.chars[character.toString()] = { voiceLan: req.voiceLan };
        data.playerDataDelta.modified.troop.chars[character.toString()].voiceLan = req.voiceLan;
    }

    user.writeUserData(savedUserData);
    return c.json(data);
}

export async function charBuildSetDefaultSkill(c: Context) {
    const { charInstId, defaultSkillIndex } = await c.req.json();

    const data = {
        playerDataDelta: {
            deleted: {},
            modified: {
                troop: {
                    chars: { [charInstId.toString()]: { defaultSkillIndex: defaultSkillIndex } },
                },
            },
        },
    };

    const savedUserData = user.readUserData();
    savedUserData.user.troop.chars[charInstId.toString()].defaultSkillIndex = defaultSkillIndex;
    user.writeUserData(savedUserData);

    return c.json(data);
}

export async function charBuildChangeCharSkin(c: Context) {
    const { charInstId, skinId } = await c.req.json();

    const data = {
        playerDataDelta: {
            deleted: {},
            modified: {
                troop: {
                    chars: { [charInstId.toString()]: { skin: skinId } },
                },
            },
        },
    };

    const userData = user.readUserData();
    userData.user.troop.chars[charInstId.toString()].skin = skinId;
    user.writeUserData(userData);

    return c.json(data);
}

export async function charBuildSetEquipment(c: Context) {
    const { charInstId, equipId } = await c.req.json();

    const data = {
        playerDataDelta: {
            deleted: {},
            modified: {
                troop: {
                    chars: { [charInstId.toString()]: { currentEquip: equipId } },
                },
            },
        },
    };

    const userData = user.readUserData();
    userData.user.troop.chars[charInstId.toString()].currentEquip = equipId;
    user.writeUserData(userData);

    return c.json(data);
}

export async function charBuildChangeCharTemplate(c: Context) {
    // Amiya-specific function.
    const { charInstId, templateId } = await c.req.json();

    const data = {
        playerDataDelta: {
            deleted: {},
            modified: {
                troop: {
                    chars: {
                        [charInstId.toString()]: {
                            currentTmpl: templateId,
                        },
                    },
                },
            },
        },
    };

    const userData = user.readUserData();
    userData.user.troop.chars[charInstId.toString()].currentTmpl = templateId;
    user.writeUserData(userData);

    return c.json(data);
}
