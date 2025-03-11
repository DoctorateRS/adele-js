import { Context } from "hono";

export function campaignV2BattleStart(c: Context) {
    return c.json({
        result: 0,
        battleId: "00000000-0000-0000-0000-000000000000",
        playerDataDelta: {
            modified: {},
            deleted: {},
        },
    });
}

export function campaignV2BattleFinish(c: Context) {
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
}

export function campaignV2BattleSweep(c: Context) {
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
}
