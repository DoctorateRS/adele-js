import { Hono } from "hono";
import DefaultUserData from "../utils/userData.ts";

const user = new Hono();

user.post("/auth/v1/token_by_phone_password", async (c) => {
    const req = await c.req.json();
    return c.json({
        data: {
            token: req.phone,
        },
        msg: "OK",
        status: 0,
        type: "A",
    });
});

user.post("/info/v1/basic", (c) => {
    return c.json({
        status: 0,
        msg: "OK",
        data: {
            hgId: "12345678",
            phone: "00000000",
            email: "00000000",
            identityNum: "123456789",
            identityName: "AdeleJs",
            isMinor: false,
            isLatestUserAgreement: true,
        },
    });
});

user.post("/oauth2/v2/grant", async (c) => {
    const req = await c.req.json();
    return c.json({
        data: {
            uid: "12345678",
            code: req.token,
        },
        msg: "OK",
        status: 0,
        type: "A",
    });
});

user.post("/online/v1/loginout", (c) => {
    return c.json({
        msg: "OK",
        status: 0,
        type: "A",
    });
});

user.post("/changeAvatar", async (c) => {
    const req = await c.req.json();
    const userData = DefaultUserData.readUserData();

    userData.status.avatar = req;
    DefaultUserData.writeUserData(userData);
    return c.json({
        playerDataDelta: {
            deleted: {},
            modified: {
                status: {
                    avatar: req,
                },
            },
        },
    });
});

user.post("/changeResume", async (c) => {
    const req = await c.req.json();
    const userData = DefaultUserData.readUserData();

    userData.status.avatar = req.resume;
    DefaultUserData.writeUserData(userData);
    return c.json({
        playerDataDelta: {
            deleted: {},
            modified: {
                status: {
                    avatar: req.resume,
                },
            },
        },
    });
});

user.post("/changeSecretary", async (c) => {
});

export default user;
