import { Hono } from "hono";
import JsonUtils from "../utils/json.ts";

const account = new Hono();

account.post("/login", async (c) => {
    interface Login {
        token: string;
    }

    const req = await c.req.json<Login>();
    return c.json({
        result: 0,
        uid: "123456789",
        secret: req.token,
        serviceLicenseVersion: 0,
        majorVersion: "354",
    });
});

account.post("/syncData", (c) => {
    const playerSyncData = JsonUtils.readJson("./resources/user/syncData.json");
    return c.json(playerSyncData);
});

account.post("/syncStatus", (c) => {
    return c.json({ result: {} });
});

account.post("/syncPushMessage", (c) => {
    return c.json({});
});

export default account;
