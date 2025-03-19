import { Context } from "hono";
import user from "../utils/userData.ts";
import excel from "../utils/excel.ts";

export function sync(c: Context) {
    const userData = user.readUserData();
    const buildingTable = excel.buildingTable();

    const chars = {};
    for (const char of Object.keys(userData.user.troop.chars)) {
        chars[char] = {
            charId: userData.user.troop.chars[char].charId,
            lastApAddTime: 1695000000,
            ap: 8640000,
            roomSlotId: "",
            index: -1,
            changeScale: 0,
            bubble: {
                normal: { add: -1, ts: 0 },
                assist: { add: -1, ts: 0 },
            },
            workTime: 0,
        };
    }

    userData.user.building.chars = chars;

    for (const slot of Object.keys(userData.user.building.roomSlots)) {
        let cnt = 0;
        for (const instId of userData.user.building.roomSlots[slot].charInstIds) {
            if (instId === -1) {
                continue;
            }

            userData.user.building.chars[instId].roomSlotId = slot;
            userData.user.building.chars[instId].index = cnt;
            cnt += 1;
        }
    }

    const furnitures = {};
    for (const furn of Object.keys(buildingTable.customData.furnitures)) {
        furnitures[furn] = { count: 9999, inUse: 0 };
    }

    userData.user.building.furniture = furnitures;
    user.writeUserData(userData);

    return c.json({
        playerDataDelta: {
            modified: {
                building: userData.user.building,
            },
            deleted: {},
        },
    });
}

export function getRecentVisitor(c: Context) {
    return c.json({
        visitors: [],
    });
}

export function getShareVisitorNum(c: Context) {
    return c.json({
        number: 0,
    });
}

export async function assignChar(c: Context) {
    interface BuildingAssignCharReq {
        roomSlotId: string;
        charInstIdList: number[];
    }

    interface HasCharInstId {
        charInstIds: number[];
    }

    let { roomSlotId, charInstIdList }: BuildingAssignCharReq = await c.req.json();

    const syncData = user.readSyncData();
    const userData = user.readUserData();
    const roomSlots = syncData.user.building.roomSlots;

    for (const slot of Object.values<HasCharInstId>(roomSlots)) {
        const roomCharInstIds = slot.charInstIds;
        charInstIdList = charInstIdList.map((v) => {
            return roomCharInstIds.includes(v) ? -1 : v;
        });
    }

    syncData.user.building.roomSlots[roomSlotId].charInstIds = charInstIdList;
    userData.user.building.roomSlots[roomSlotId].charInstIds = charInstIdList;

    if (roomSlotId === "slot_13" && charInstIdList.length < 2) {
        const trainer = charInstIdList[0];
        const trainee = charInstIdList[1];

        const trainingRoom = syncData.user.building.rooms["TRAINING"][roomSlotId];

        trainingRoom.trainee = {
            charInstId: trainee,
            processPoint: -1,
            speed: 1,
            state: 0,
            targetSkill: -1,
        };

        trainingRoom.trainee.state = (trainee === -1) ? 0 : 3;
        trainingRoom.trainer.state = (trainer === -1) ? 0 : 3;

        syncData.user.building.rooms["TRAINING"][roomSlotId] = trainingRoom;
        userData.user.building.rooms["TRAINING"][roomSlotId] = trainingRoom;
    }

    user.writeUserData(userData);
    user.writeSyncData(syncData);

    return c.json({
        playerDataDelta: {
            modified: {
                building: userData.user.building,
                event: userData.user.event,
            },
            deleted: {},
        },
    });
}

export async function changeDiySolution(c: Context) {
    const { roomSlotId, solution } = await c.req.json();
    const syncData = user.readSyncData();
    const userData = user.readUserData();

    syncData.user.building.rooms["DORMITORY"][roomSlotId].diySolution = solution;
    userData.user.building.rooms["DORMITORY"][roomSlotId].diySolution = solution;

    user.writeUserData(userData);
    user.writeSyncData(syncData);

    return c.json({
        playerDataDelta: {
            modified: {
                building: userData.user.building,
                event: userData.user.event,
            },
            deleted: {},
        },
    });
}

export async function changeManufactureSolution(c: Context) {
    const { roomSlotId, targetFormulaId, solutionCount } = await c.req.json();

    const n = 3;
    n.toString();

    const syncData = user.readSyncData();
    const userData = user.readUserData();

    const outputSolutionCnt = userData.user.building.rooms["MANUFACTURE"][roomSlotId.toString()].outputSolutionCnt;
    const formulaId = userData.user.building.rooms["MANUFACTURE"][roomSlotId.toString()];

    return c.json({
        playerDataDelta: {
            modified: {
                //    building: user_sync_data["building"],
                //    event: user_sync_data["event"],
                //    inventory: user_sync_data["inventory"],
                //    status: user_sync_data["status"],
            },
            deleted: {},
        },
    });
}

export function getClueBox(c: Context) {
    return c.json({
        box: [],
    });
}

export function getClueFriendList(c: Context) {
    return c.json({
        result: [],
    });
}
