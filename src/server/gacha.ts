import { Context } from "hono";
import gachaPools from "../utils/gacha.ts";
import user from "../utils/userData.ts";

export function syncNormalGacha(c: Context) {
    return c.json({
        playerDataDelta: {
            modified: {
                recruit: {
                    normal: {
                        slots: gachaPools.normalGacha().detailInfo.availCharInfo.perAvailList,
                    },
                },
            },
            deleted: {},
        },
    });
}

export async function normalGacha(c: Context) {
    const { slotId, tagList, duration } = await c.req.json();
    const userData = user.readUserData();
    const ts = Date.now();

    const slot = slotId.toString();

    userData.user.recruit.normal.slots[slot].state = 2;
    userData.user.recruit.normal.slots[slot].selectTags = tagList.map((tag) => {
        return {
            pick: 1,
            tagId: tag,
        };
    });
    userData.user.recruit.normal.slots[slot].startTs = ts;
    userData.user.recruit.normal.slots[slot].durationInSec = duration;
    userData.user.recruit.normal.slots[slot].maxFinishTs = ts + duration;
    userData.user.recruit.normal.slots[slot].realFinishTs = ts + duration;

    user.writeUserData(userData);
    return c.json({
        playerDataDelta: {
            modified: {
                recruit: {
                    normal: {
                        slots: {
                            [slot]: userData.user.recruit.normal.slots[slot],
                        },
                    },
                },
            },
            deleted: {},
        },
    });
}

export async function finishNormalGacha(c: Context) {
    const { slotId } = await c.req.json();
    const userData = user.readUserData();
}
