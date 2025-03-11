import { Context } from "hono";
import user from "../utils/userData.ts";
import excel from "../utils/excel.ts";
import { range } from "../utils/numbers.ts";

export function buildingSync(c: Context) {
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

export function buildingGetRecentVisitor(c: Context) {
    return c.json({
        visitors: [],
    });
}

export function buildingGetShareVisitorNum(c: Context) {
    return c.json({
        number: 0,
    });
}

export async function buildingAssignChar(c: Context) {
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
