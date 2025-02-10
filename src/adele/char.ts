import { Hono } from "hono";
import DefaultUserData from "../utils/userData.ts";

const char = new Hono();

char.post("/changeStarMark", async (c) => {
    const req = await c.req.json();

    const delta = {
        playerDataDelta: {
            deleted: {},
            modified: {
                troop: {
                    chars: {},
                },
            },
        },
    };

    const savedData = DefaultUserData.readUserData();
    const characters = savedData.user.troop.chars;

    for (const char of Object.keys(req.set)) {
        const indexList = [];

        for (const [charIdx, savedChar] of Object.entries(characters)) {
            if (savedData.charId === char) {
                indexList.push(charIdx);
            }
        }

        for (const idx of indexList) {
            savedData.user.troop.chars[idx].starMark = req.set[char];
            delta.playerDataDelta.modified.troop.chars[idx].starMark = req.set[char];
        }
    }

    DefaultUserData.writeUserData(savedData);

    return c.json(delta);
});

export default char;
