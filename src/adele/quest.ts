import { Context } from "hono";
import { Hono, HonoRequest } from "hono";
import DefaultUserData from "../utils/userData.ts";

export const quest = new Hono();

quest.post("/battleStart", questBattleStart);
quest.post("/battleFinish", questBattleFinish);

quest.post("/battleContinue", (c) => {
    return c.json({
        result: 0,
        battleId: "abcdefgh-1234-5678-a1b2c3d4e5f6",
        apFailReturn: 0,
        playerDataDelta: {
            modified: {},
            deleted: {},
        },
    });
});

quest.post("/saveBattleReplay", async (c) => {
    const req = await c.req.json();
    const replayData = DefaultUserData.readBattleReplayData();

    const charConfig = replayData.currentCharConfig;

    if (Object.keys(replayData.saved).includes(charConfig)) {
        replayData.saved[charConfig][replayData.current] = req.battleReplay;
    } else {
        replayData.saved[charConfig] = {
            [replayData.current]: req.battleReplay,
        };
    }

    replayData.current = null;
    DefaultUserData.writeBattleReplayData(replayData);

    return c.json({
        result: 0,
        playerDataDelta: {
            modified: {
                dungeon: {
                    stages: {
                        [replayData.current]: {
                            hasBattleReplay: 1,
                        },
                    },
                },
            },
            deleted: {},
        },
    });
});

quest.post("/getBattleReplay", async (c) => {
    const req = await c.req.json();
    const stageId = req.stageId;
    const battleReplay = DefaultUserData.readBattleReplayData();

    return c.json({
        battleReplay: battleReplay.saved[battleReplay.currentCharConfig][stageId],
        playerDataDelta: {
            modified: {},
            deleted: {},
        },
    });
});

export async function questBattleStart(c: Context) {
    const req = await c.req.json();
    const battleReplay = DefaultUserData.readBattleReplayData();

    battleReplay.current = req.stageId;
    DefaultUserData.writeBattleReplayData(battleReplay);

    return c.json({
        apFailReturn: 0,
        battleId: "abcdefgh-1234-5678-a1b2c3d4e5f6",
        inApProtectPeriod: false,
        isApProtect: 0,
        notifyPowerScoreNotEnoughIfFailed: false,
        playerDataDelta: {
            modified: {},
            deleted: {},
        },
        result: 0,
    });
}

export function questBattleFinish(c: Context) {
    return c.json({
        result: 0,
        apFailReturn: 0,
        expScale: 1.2,
        goldScale: 1.2,
        rewards: [],
        firstRewards: [],
        unlockStages: [],
        unusualRewards: [],
        additionalRewards: [],
        furnitureRewards: [],
        alert: [],
        suggestFriend: false,
        pryResult: [],
        playerDataDelta: {
            modified: {},
            deleted: {},
        },
    });
}
