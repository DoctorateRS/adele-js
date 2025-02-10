import { Hono } from "hono";

const campaignV2 = new Hono();

campaignV2.post("/battleStart", (c) => {
    return c.json({
        result: 0,
        battleId: "00000000-0000-0000-0000-000000000000",
        playerDataDelta: {
            modified: {},
            deleted: {},
        },
    });
});

campaignV2.post("/battleFinish", (c) => {
    return c.json({
        result: 0,
        apFailReturn: 0,
        rewards: [],
        unusualRewards: [],
        additionalRewards: [],
        diamondMaterialRewards: [],
        furnitureRewards: [],
        currentFeeBefore: 1800,
        currentFeeAfter: 1800,
        unlockStages: [],
        playerDataDelta: {
            modified: {},
            deleted: {},
        },
    });
});

campaignV2.post("/battleSweep", (c) => {
    return c.json({
        result: 0,
        apFailReturn: 1,
        rewards: [],
        unlockStages: [],
        unusualRewards: [],
        additionalRewards: [],
        furnitureRewards: [],
        diamondMaterialRewards: [{ type: "DIAMOND_SHD", id: "4003", count: 1 }],
        currentFeeBefore: 1800,
        currentFeeAfter: 1800,
        playerDataDelta: {
            modified: {},
            deleted: {},
        },
    });
});

export default campaignV2;
