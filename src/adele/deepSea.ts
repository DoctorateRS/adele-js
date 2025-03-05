import { Hono } from "hono";
import DefaultUserData from "../utils/userData.ts";

const deepSea = new Hono();

deepSea.post("/branch", async (c) => {
    const req = await c.req.json();
    const branches = req.branches;

    const techTrees = {};

    for (const branch of branches) {
        techTrees[branch.techTreeId] = {
            branch: branch.branchId,
            state: 2,
        };
    }

    const userData = DefaultUserData.readUserData();
    userData.user.deepSea.techTrees = techTrees;
    DefaultUserData.writeUserData(userData);

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
});

deepSea.post("/event", (c) => {
    return c.json({
        playerDataDelta: {
            deleted: {},
            modified: {},
        },
    });
});

export default deepSea;
