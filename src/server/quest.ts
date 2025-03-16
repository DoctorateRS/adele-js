import { Context } from "hono";
import battleReplay from "../utils/battleReplay.ts";
import user from "../utils/userData.ts";
import { assist } from "../models/mod.ts";
import config from "../config/mod.ts";
import { extractCharInstId } from "../utils/mod.ts";

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

export function battleContinue(c: Context) {
    return c.json({
        result: 0,
        battleId: "abcdefgh-1234-5678-a1b2c3d4e5f6",
        apFailReturn: 0,
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
            modified: {
                troop: {
                    squads: {
                        [req.squadId.toString()]: {
                            name: req.name,
                        },
                    },
                },
            },
            deleted: {},
        },
    };

    const userData = user.readUserData();
    const syncData = user.readSyncData();
    userData.user.troop.squads[req.squadId.toString()].name = req.name;
    syncData.user.troop.squads[req.squadId.toString()].name = req.name;

    user.writeUserData(userData);
    user.writeSyncData(syncData);

    return c.json(res);
}

export async function changeSquadFormation(c: Context) {
    const req = await c.req.json();

    const res = {
        playerDataDelta: {
            modified: {
                troop: {
                    squads: {
                        [req.squadId.toString()]: {
                            slots: req.slots,
                        },
                    },
                },
            },
            deleted: {},
        },
    };

    const userData = user.readUserData();
    const syncData = user.readSyncData();
    userData.user.troop.squads[req.squadId.toString()].slots = req.slots;
    syncData.user.troop.squads[req.squadId.toString()].slots = req.slots;

    user.writeUserData(userData);
    user.writeSyncData(syncData);

    return c.json(res);
}

export function getAssistList(c: Context) {
    const userData = user.readUserData();
    const res = {
        allowAskTs: Date.now(),
        assistList: [],
        playerDataDelta: {
            modified: {},
            deleted: {},
        },
    };

    let chars = [];
    for (const assistIdx of config.user.assists) {
        if (chars.length === 3) {
            const assister = new assist.Assister();
            assister.assistCharList = chars;
            res.assistList.push(assister);

            chars = [];
        }

        const idx = extractCharInstId(assistIdx).toString();
        chars.push(userData.user.troop.chars[idx]);
    }

    return c.json(res);
}

export function markStoryAcceKnown(c: Context) {
    return c.json({
        playerDataDelta: {
            modified: {
                storyreview: {
                    tags: { knownStoryAcceleration: 1 },
                },
            },
            deleted: {},
        },
    });
}

export async function changeBattleCar(c: Context) {
    const req = await c.req.json();

    const userData = user.readUserData();
    const syncData = user.readSyncData();

    userData.user.car.battleCar = req.car;
    syncData.user.car.battleCar = req.car;

    return c.json({
        playerDataDelta: {
            modified: {
                car: {
                    battleCar: req.car,
                },
            },
            deleted: {},
        },
    });
}

export function type20ActSideCompetitionStart(c: Context) {
    return c.json({
        result: 0,
        battleId: "abcdefgh-1234-5678-a1b2c3d4e5f6",
        playerDataDelta: {
            modified: {},
            deleted: {},
        },
    });
}

export function type20ActSideCompetitionFinish(c: Context) {
    return c.json({
        performance: 0,
        expression: 0,
        operation: 0,
        total: 0,
        level: "B",
        isNew: false,
        playerDataDelta: {
            modified: {},
            deleted: {},
        },
    });
}

export function readStory(c: Context) {
    return c.json({
        readStory: 1,
        playerDataDelta: {
            modified: {},
            deleted: {},
        },
    });
}

export async function setTrapSquad(c: Context) {
    const req = await c.req.json();

    return c.json({
        playerDataDelta: {
            modified: {
                templateTrap: {
                    domains: {
                        [req.trapDomainId]: {
                            squad: req.trapSquad,
                        },
                    },
                },
            },
            deleted: {},
        },
    });
}

export async function relicSelect(c: Context) {
    const req = await c.req.json();

    return c.json({
        playerDataDelta: {
            modified: {
                activity: {
                    ["BOSS_RUSH"]: {
                        [req.activityId]: {
                            relic: {
                                select: req.relicId,
                            },
                        },
                    },
                },
            },
            deleted: {},
        },
    });
}

export async function setTool(c: Context) {
    const req = await c.req.json();
    const tools = {
        ["tool_trap"]: 1,
        ["tool_wirebug"]: 1,
        ["tool_flashbomb"]: 1,
        ["tool_bomb"]: 1,
    };

    for (const key in req.tools) {
        tools[key] = 2;
    }

    return c.json({
        playerDataDelta: {
            modified: {
                activity: {
                    ["TYPE_ACT24SIDE"]: {
                        act24side: {
                            tool: tools,
                        },
                    },
                },
            },
            deleted: {},
        },
    });
}
