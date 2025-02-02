import { Router } from "oak";
export const masterRouter = new Router();
import { accountRouter } from "./account.ts";
masterRouter.use("/account", accountRouter.routes(), accountRouter.allowedMethods());
