import { Router } from "oak";
import type { Context } from "oak";

export const accountRouter = new Router();

import syncData from "../../resources/user/syncData.json" with { type: "json" };

async function accountLogin(ctx: Context) {
    const req = await ctx.request.body.json();
    ctx.response.body = {
        result: 0,
        uid: "123456789",
        secret: req.token ? req.token : "0",
        serviceLicenseVersion: 0,
        majorVersion: "354",
    };
}

async function accountSyncData(ctx: Context) {
    let tmpl = syncData;
}

accountRouter.post("/login", accountLogin);
