import { Context } from "hono";
import user from "../utils/userData.ts";

interface HasCharId {
    charId: string;
}

export async function charChangeMarkStar(c: Context) {
    const { set } = await c.req.json();

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

    const userData = user.readUserData();
    const characters = userData.user.troop.chars;

    for (const char of Object.keys(set)) {
        const idxList: string[] = [];
        for (const [idx, charInst] of Object.entries<HasCharId>(characters)) {
            if (charInst.charId === char) {
                idxList.push(idx);
            }
        }

        for (const idx of idxList) {
            data.playerDataDelta.modified.troop.chars[idx] = { starMark: set[char] };
            userData.user.troop.chars[idx].starMark = set[char];
        }
    }

    user.writeUserData(userData);
    return c.json(data);
}
