import { Hono } from "hono";
import settings from "../settings.ts";
import JsonUtils from "../utils/json.ts";
import { max, sum } from "../utils/numbers.ts";

const crisisV2 = new Hono();

class CrisisRecord {
    previousMaxScore: number;
    previousScore: number[];

    constructor(previousMaxScore?: number, previousScore?: number[]) {
        this.previousMaxScore = previousMaxScore !== undefined ? previousMaxScore : 0;
        this.previousScore = previousScore !== undefined ? previousScore : [0, 0, 0, 0, 0, 0];
    }

    update(newMaxScore?: number, newScore?: number[]) {
        this.previousMaxScore = newMaxScore !== undefined ? newMaxScore : this.previousMaxScore;
        this.previousScore = newScore !== undefined ? newScore : this.previousScore;

        JsonUtils.writeJson("./resources/user/crisisRecord.json", this);
    }
}

crisisV2.post("/getInfo", (c) => {
    if (settings.crisisV2Config.selectedCrisis !== "") {
        return c.json(
            JsonUtils.readJson(
                `"./resources/cc/${settings.crisisV2Config.selectedCrisis}"`,
            ),
        );
    } else {
        return c.json({
            info: {},
            ts: Date.now(),
            playerDataDelta: {
                modified: {},
                deleted: {},
            },
        });
    }
});

crisisV2.post("/battleStart", async (c) => {
    const req = await c.req.json();
    const battleData = {
        mapId: req.mapId,
        runeSlots: req.runeSlots,
    };

    JsonUtils.writeJson("./resources/user/rune.json", battleData);
    return c.json({
        result: 0,
        battleId: "abcdefgh-1234-5678-a1b2c3d4e5f6",
        playerDataDelta: {
            modified: {},
            deleted: {},
        },
    });
});

crisisV2.post("/battleFinish", (c) => {
    let crisisRecord: CrisisRecord;
    if (
        Deno.readDirSync("./resources/user/").find((e, _) => {
            return e.name === "crisisRecord.json";
        })
    ) {
        crisisRecord = JsonUtils.readJsonAs<CrisisRecord>(
            "./resources/user/crisisRecord.json",
        );
    } else {
        crisisRecord = new CrisisRecord();
    }

    const battleData = JsonUtils.readJson("./resources/user/rune.json");
    const runes = JsonUtils.readJson(
        `"./resources/cc/${settings.crisisV2Config.selectedCrisis}"`,
    );

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
            for (
                const slot of Object.values(nodes[slotPackId][mutualExclusionGroup])
            ) {
                scoreMax = max(scoreMax, slot);
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
    if (crisisRecord.previousMaxScore < sum(scoreCurrent)) {
        isNewRecord = true;
    }

    const result = {
        result: 0,
        mapId: battleData.mapId,
        runeSlots: battleData.runeSlots,
        isNewRecord: isNewRecord,
        scoreRecord: crisisRecord.previousScore,
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
        crisisRecord.update(sum(scoreCurrent), scoreCurrent);
    }

    return c.json(result);
});

crisisV2.post("/getSnapshot", (c) => {
    return c.json({
        detail: {},
        simple: {},
        playerDataDelta: {
            modified: {},
            deleted: {},
        },
    });
});

export default crisisV2;
