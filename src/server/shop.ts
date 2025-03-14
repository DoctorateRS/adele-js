import { Context } from "hono";
import shop from "../utils/shop.ts";
import user from "../utils/userData.ts";
import { defaultPlayerDataDelta } from "../utils/mod.ts";

interface ShopItem {
    id: string;
    type: string;
    count: number;
}

function matchShopQuery(query: string) {
    return query.startsWith("get") && query.endsWith("GoodList");
}

export function getGoodPurchaseState(c: Context) {
    return c.json({
        result: {},
        playerDataDelta: {
            modified: {},
            deleted: {},
        },
    });
}

export function getShopGoodList(c: Context) {
    const { shopQuery } = c.req.param();

    if (matchShopQuery(shopQuery)) {
        try {
            const query = shopQuery.substring(3, shopQuery.length - 8);
            return c.json(shop.shop()[query]);
        } catch (e) {
            console.log(`Error querying shop at ${e}`);
            return c.json({});
        }
    } else {
        return c.json({});
    }
}

export async function buySkinGood(c: Context) {
    interface SkinGood {
        goodId: string;
        originPrice: number;
    }

    const req = await c.req.json();

    const skinShop = shop.shop().skin;
    const userData = user.readUserData();

    let good: SkinGood | null = null;
    for (const skin of <SkinGood[]> skinShop.goodList) {
        if (skin.goodId === req.goodId) {
            good = skin;
            break;
        }
    }

    if (good === null) {
        return c.json(defaultPlayerDataDelta);
    }

    if (userData.user.status.androidDiamond >= good.originPrice) {
        userData.user.skin.characterSkins[good.goodId.substring(3)] = 1;
        userData.user.skin.skinTs[good.goodId.substring(3)] = Date.now();
        userData.user.status.androidDiamond -= good.originPrice;
        userData.user.status.iosDiamond -= good.originPrice;
    }

    return c.json({
        playerDataDelta: {
            deleted: {},
            modified: {
                skin: userData.user.skin,
                status: {
                    androidDiamond: userData.user.status.androidDiamond,
                    iosDiamond: userData.user.status.iosDiamond,
                },
            },
        },
        result: 0,
    });
}

export async function buyLowGood(c: Context) {
    interface LowGood {
        goodId: string;
        price: number;
        item: ShopItem;
    }

    const req = await c.req.json();

    const lowShop = shop.shop().low;
    const userData = user.readUserData();

    let good: LowGood | null = null;
    for (const lowGood of <LowGood[]> lowShop.goodList) {
        if (lowGood.goodId === req.goodId) {
            good = lowGood;
            break;
        }
    }

    if (good === null) {
        return c.json(defaultPlayerDataDelta);
    }

    if (userData.user.status.lggShard >= (good.price * req.count)) {
        userData.user.status.lggShard -= good.price * req.count;
        const { id, count } = good.item;
        const rewardCount = count * req.count;

        if (Object.keys(userData.user.inventory).includes(id)) {
            userData.user.inventory[id] += rewardCount;
        } else {
            userData.user.inventory[id] = rewardCount;
        }
    }

    user.writeUserData(userData);
    return c.json({
        playerDataDelta: {
            deleted: {},
            modified: {
                skin: userData.user.skin,
                status: userData.user.status,
                shop: userData.user.shop,
                troop: userData.user.troop,
                inventory: userData.user.inventory,
            },
        },
        items: [],
        result: 0,
    });
}
