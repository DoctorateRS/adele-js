import { Hono } from "hono";
import DefaultShopManager from "../utils/shopManager.ts";
import DefaultUserData from "../utils/userData.ts";

const shop = new Hono();

const shopList = DefaultShopManager.getShopJson();
const startsMatch = new RegExp("^get");
const endsMatch = new RegExp("GoodList$");

function getShopId(input: string): string {
    return input.replace(startsMatch, "").replace(endsMatch, "").toLowerCase();
}

shop.post("/getGoodPurchaseState", (c) => {
    return c.json({
        playerDataDelta: {
            modified: {},
            deleted: {},
        },
        result: {},
    });
});

shop.post("/:shop", (c) => {
    const shop = c.req.param("shop");
    const shopId = getShopId(shop);
    const opt = shopList[shopId];

    return c.json(opt ? opt : {});
});

shop.post("/buySkinGood", async (c) => {
    const req = await c.req.json();
    const goodId = req.goodId;

    const skinShop = shopList["skin"];
    const userData = DefaultUserData.readUserData();

    for (const good of skinShop.goodList) {
        if (goodId === good.goodId) {
            const price = good.originPrice;
            const skinId = goodId.substring(2);

            userData.user.skin.characterSkins[skinId] = 1;
            userData.user.skin.skinTs[skinId] = Date.now();
            userData.user.status.androidDiamond -= price;
            userData.user.status.iosDiamond -= price;
            break;
        }
    }

    DefaultUserData.writeUserData(userData);

    return c.json({
        playerDataDelta: {
            modified: {
                skin: userData.user.skin,
                status: {
                    androidDiamond: userData.user.status.androidDiamond,
                    iosDiamond: userData.user.status.iosDiamond,
                },
            },
            deleted: {},
        },
        result: 0,
    });
});

shop.post("/buyLowGood", async (c) => {
    const req = await c.req.json();

    const { goodId, count } = req;
    // let items = [];

    const lowShop = shopList["low"];
    const userData = DefaultUserData.readUserData();

    for (const lowGood of lowShop.goodList) {
        if (goodId === lowGood.goodId) {
            userData.user.status.lggShard -= lowGood.price * count;

            const rewardId = lowGood.item.id;
            const rewardCount = lowGood.item.count * count;

            for (const item of userData.user.inventory) {
                if (item.id === rewardId) {
                    item.count += rewardCount;
                }
            }

            break;
        }
    }

    DefaultUserData.writeUserData(userData);

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
});

export default shop;
