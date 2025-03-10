import { Context } from "hono";
import json from "../utils/json.ts";
import config from "../config/mod.ts";
import shop from "../utils/shop.ts";
import { max, sum, sumArr } from "../utils/numbers.ts";

class CrisisRecord {
    internal: { previousMaxScore: number; previousScore: number[] };

    constructor(default_value?: { previousMaxScore: number; previousScore: number[] }) {
        try {
            this.internal = json.readJson("./resources/user/crisisRecord.json");
        } catch {
            this.internal.previousMaxScore = default_value.previousMaxScore ? default_value.previousMaxScore : 0;
            this.internal.previousScore = (default_value.previousScore || default_value.previousScore.length !== 6) ? default_value.previousScore : [0, 0, 0, 0, 0, 0];
        }
    }

    update(newMaxScore?: number, newScore?: number[]) {
        this.internal.previousMaxScore = newMaxScore !== undefined ? newMaxScore : this.internal.previousMaxScore;
        this.internal.previousScore = (newScore !== undefined && newScore.length !== 6) ? newScore : this.internal.previousScore;
        json.writeJson(this.internal, "./resources/user/crisisRecord.json");
    }
}

export function crisisV2GetInfo(c: Context) {
    if (config.season.crisisV2) {
        return c.json(json.readJson(`./resources/cc/${config.season.crisisV2}.json`));
    } else {
        return c.json({
            info: {},
            ts: 0,
            playerDataDelta: {
                modified: {},
                deleted: {},
            },
        });
    }
}

export async function crisisV2BattleStart(c: Context) {
    const { mapId, runeSlots } = await c.req.json();
    json.writeJson({ mapId, runeSlots }, "./resources/user/rune.json");
    return c.json({
        result: 0,
        battleId: "abcdefgh-1234-5678-a1b2c3d4e5f6",
        playerDataDelta: {
            modified: {},
            deleted: {},
        },
    });
}

export function crisisV2BattleFinish(c: Context) {
    try {
        const crisisRecord = new CrisisRecord();
        const battleData = json.readJson("./resources/user/rune.json");

        const runes = json.readJson(`"./resources/cc/${config.season.crisisV2}"`);

        const scoreCurrent = [0, 0, 0, 0, 0, 0];

        const runeIds = [];
        const nodes = {};

        const nodeDataMap = runes.info.mapDetailDataMap[battleData.mapId].nodeDataMap;

        for (const slot of Object.keys(nodeDataMap)) {
            let score = 0;

            if (!slot.startsWith("node_")) continue;
            const nodeData = nodeDataMap[slot];
            const nodeSlotPackId = nodeData.slotPackId;

            if (!nodeSlotPackId) continue;

            if (!Object.keys(nodes).includes(nodeSlotPackId)) {
                nodes[nodeSlotPackId] = {};
            }

            let mutualExclusionGroup;
            if (nodeData.mutualExclusionGroup) {
                mutualExclusionGroup = slot;
            } else {
                mutualExclusionGroup = nodeData.mutualExclusionGroup;
            }

            if (!Object.keys(nodes[nodeSlotPackId]).includes(mutualExclusionGroup)) {
                nodes[nodeSlotPackId][mutualExclusionGroup] = {};
            }

            if (Object.hasOwn(nodeData, "runeId")) {
                const runeId = nodeData.runeId;

                if (runeId) {
                    const runeData = runes.info.mapDetailDataMap[battleData.mapId].runeDataMap[runeId];
                    score = runeData.score;
                }
            }

            nodes[nodeSlotPackId][mutualExclusionGroup][slot] = score;
        }

        const slots = new Set(battleData.runeSlots);

        for (const slotPackId of Object.keys(nodes)) {
            let flag = true;

            for (const mutualExclusionGroup of Object.keys(nodes[slotPackId])) {
                let scoreMax = 0;

                for (const slot of Object.values(nodes[slotPackId][mutualExclusionGroup])) {
                    scoreMax = max(scoreMax, <number> slot);
                }

                let flagRt = false;
                for (const slot of Object.keys(nodes[slotPackId][mutualExclusionGroup])) {
                    if (nodes[slotPackId][mutualExclusionGroup][slot] !== scoreMax) {
                        continue;
                    }

                    if (slots.has(slot)) {
                        flagRt = true;
                        break;
                    }
                }

                if (!flagRt) {
                    flag = false;
                    break;
                }
            }

            if (flag) {
                const bagData = runes.info.mapDetailDataMap[battleData.mapId].bagDataMap[slotPackId];

                scoreCurrent[bagData.dimension] += bagData.rewardScore;
            }
        }

        for (const slot of battleData.runeSlots) {
            const nodeData = runes.info.mapDetailDataMap[battleData.mapId].nodeDataMap[slot];

            if (Object.hasOwn(nodeData, "runeId")) {
                const runeId = runes.info.mapDetailDataMap[battleData.mapId].nodeDataMap.runeId;

                runeIds.push(runeId);

                const runeData = runes.info.mapDetailDataMap[battleData.mapId].runeDataMap[runeId];

                scoreCurrent[runeData.dimension] += runeData.score;
            }
        }

        let isNewRecord = false;

        if (crisisRecord.internal.previousMaxScore < sumArr(scoreCurrent)) {
            isNewRecord = true;
        }

        const result = {
            result: 0,
            mapId: battleData.mapId,
            runeSlots: battleData.runeSlots,
            isNewRecord: isNewRecord,
            scoreRecord: crisisRecord.internal.previousScore,
            scoreCurrent: scoreCurrent,
            runeCount: [0, 0],
            commentNew: [],
            commentOld: [],
            ts: Date.now(),
            playerDataDelta: {
                modified: {},
                deleted: {},
            },
        };

        if (isNewRecord) {
            crisisRecord.update(sumArr(scoreCurrent), scoreCurrent);
        }

        return c.json(result);
    } catch {
        return c.json({});
    }
}

export function crisisV2GetSnapshot(c: Context) {
    return c.json({
        detail: {},
        simple: {},
        playerDataDelta: {
            modified: {},
            deleted: {},
        },
    });
}

export function crisisV2GetGoodList(c: Context) {
    return c.json(shop.shop()["crisisV2"]);
}

export function crisisV2ConfirmMissions(c: Context) {
    return c.json({
        pushMessage: [],
        playerDataDelta: {
            modified: {},
            deleted: {},
        },
    });
}
