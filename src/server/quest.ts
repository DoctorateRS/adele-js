import { Context } from "hono";
import battleReplay from "../utils/replay.ts";

export async function questBattleStart(c: Context) {
    const req = await c.req.json();
    const battleReplayInst = battleReplay.readBattleReplay();
    battleReplayInst.current = req.stageId;
    battleReplay.writeBattleReplay(battleReplayInst);

    return c.json({
        apFailReturn: 0,
        battleId: "abcdefgh-1234-5678-a1b2c3d4e5f6",
        inApProtectPeriod: false,
        isApProtect: 0,
        notifyPowerScoreNotEnoughIfFailed: false,
        result: 0,
        playerDataDelta: {
            modified: {},
            deleted: {},
        },
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
