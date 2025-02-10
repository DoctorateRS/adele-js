import { Hono } from "hono";
import DefaultUserData from "../utils/userData.ts";

const charBuild = new Hono();

charBuild.post("/batchSetCharVoiceLan", (c) => {
    return c.json({
        result: {},
        playerDataDelta: {
            modified: {},
            deleted: {},
        },
    });
});

charBuild.post("/addonStory/unlock", async (c) => {
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

    const savedUserData = DefaultUserData.readUserData();

    savedUserData.user.troop.addon[req.storyId] = { story: { [req.storyId]: ts } };
    data.playerDataDelta.modified.troop.addon[req.storyId] = { story: { [req.storyId]: ts } };

    DefaultUserData.writeUserData(savedUserData);
    return data;
});

charBuild.post("/setCharVoiceLan", async (c) => {
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

    const savedUserData = DefaultUserData.readUserData();
    for (const character of Object.values(req.charList)) {
        savedUserData.user.troop.chars[character.toString()].voiceLan = req.voiceLan;
        data.playerDataDelta.modified.troop.chars[character.toString()].voiceLan = req.voiceLan;
    }

    DefaultUserData.writeUserData(savedUserData);
    return c.json(data);
});

charBuild.post("/setDefaultSkill", async (c) => {
    const { charInstId, defaultSkillIndex } = await c.req.json();

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

    const savedUserData = DefaultUserData.readUserData();
    data.playerDataDelta.modified.troop.chars[charInstId.toString()].defaultSkillIndex = defaultSkillIndex;
    savedUserData.user.troop.chars[charInstId.toString()].defaultSkillIndex = defaultSkillIndex;

    DefaultUserData.writeUserData(savedUserData);
    return c.json(data);
});

export default charBuild;
