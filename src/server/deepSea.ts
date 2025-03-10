import { Context } from "hono";
import { defaultPlayerDataDelta } from "../utils/mod.ts";
import user from "../utils/userData.ts";

export async function deepSeaBranch(c: Context) {
    const req = await c.req.json();

    const techTrees = {};
    for (const branch of req.branches) {
        techTrees[branch.techTreeId] = { branch: branch.branchId, state: 2 };
    }

    const userData = user.readUserData();
    userData.user.deepSea.techTrees = techTrees;
    user.writeUserData(userData);

    return c.json({
        playerDataDelta: {
            modified: {
                deepSea: {
                    techTrees: techTrees,
                },
            },
            deleted: {},
        },
    });
}

export function deepSeaEvent(c: Context) {
    return c.json(defaultPlayerDataDelta);
}
