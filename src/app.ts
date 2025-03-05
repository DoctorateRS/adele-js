import { Hono } from "hono";
import { logger } from "hono/logger";
import log, { adeleLogger } from "./utils/logging.ts";
import { StaticPlayerDataDelta } from "./playerData/delta.ts";

import asset from "./adele/assetbundle.ts";
import account from "./adele/account.ts";
import crisisV2 from "./adele/crisis.ts";
import charBuild from "./adele/charBuild.ts";
import campaignV2 from "./adele/campaignV2.ts";
import charRotation from "./adele/charRotation.ts";
import pay from "./adele/pay.ts";
import deepSea from "./adele/deepSea.ts";

const app = new Hono();
const staticPdd = new StaticPlayerDataDelta();

app.use(adeleLogger);
app.use(logger(log));

app.route("/assetbundle/official/Android/assets", asset);
app.route("/account", account);
app.route("/campaignV2", campaignV2);
app.route("/charBuild", charBuild);
app.route("/charRotation", charRotation);
app.route("/crisisV2", crisisV2);
app.route("/deepSea", deepSea);
app.route("/pay", pay);

app.notFound((c) => {
    return c.json(staticPdd);
});

export default app;
