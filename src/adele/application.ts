import { Hono } from "hono";
import { logger } from "hono/logger";
import log, { adeleLogger } from "../utils/logging.ts";
import asset from "./assetbundle.ts";
import account from "./account.ts";
import { StaticPlayerDataDelta } from "../playerData/delta.ts";
import pay from "./pay.ts";
import crisisV2 from "./crisis.ts";
import charBuild from "./charBuild.ts";
import campaignV2 from "./campaignV2.ts";
import charRotation from "./charRotation.ts";

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
app.route("/pay", pay);

app.notFound((c) => {
    return c.json(staticPdd);
});

export default app;
