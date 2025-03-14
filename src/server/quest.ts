import { Context } from "hono";
import battleReplay from "../utils/replay.ts";

export async function battleStart(c: Context) {
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

export function battleFinish(c: Context) {
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

export async function saveBattleReplay(c: Context) {
    const req = await c.req.json();

    const battleReplayInst = battleReplay.readBattleReplay();
    const charConfig = battleReplayInst.currentCharConfig;

    if (Object.keys(battleReplayInst.saved).includes(charConfig)) {
        battleReplayInst.saved[charConfig][battleReplayInst.current] = req.battleReplay;
    } else {
        battleReplayInst.saved[charConfig] = { [battleReplayInst.current]: req.battleReplay };
    }

    const cur = battleReplayInst.current;
    battleReplayInst.current = null;
    battleReplay.writeBattleReplay(battleReplayInst);

    return c.json({
        result: 0,
        playerDataDelta: {
            modified: { dungeon: { stages: { [<string> cur]: { hasBattleReplay: 1 } } } },
            deleted: {},
        },
    });
}

export async function getBattleReplay(c: Context) {
    const req = await c.req.json();
    const battleReplayInst = battleReplay.readBattleReplay();

    return c.json({
        battleReplay: battleReplayInst.saved[battleReplayInst.currentCharConfig][req.stageId],
        playerDataDelta: {
            modified: {},
            deleted: {},
        },
    });
}

export async function changeSquadName(c: Context) {
    const req = await c.req.json();
    const res = {
        playerDataDelta: {
            modified: { troop: { squads: {} } },
            deleted: {},
        },
    };
}
