import { Context } from "hono";
import user from "../utils/userData.ts";
import { configManager } from "../config/mod.ts";

export async function setBackground(c: Context) {
    const req = await c.req.json();

    const userData = user.readUserData();
    userData.user.background.selected = req.bgID;
    user.writeUserData(userData);

    const cfg = configManager.readConfig();
    cfg.user.background = req.bgID;
    configManager.writeConfig(cfg);

    return c.json({
        playerDataDelta: {
            modified: {
                background: {
                    selected: req.bgID,
                },
            },
            deleted: {},
        },
    });
}

export async function setTheme(c: Context) {
    const req = await c.req.json();

    const userData = user.readUserData();
    userData.user.homeTheme.selected = req.themeId;
    user.writeUserData(userData);

    const cfg = configManager.readConfig();
    cfg.user.theme = req.themeId;
    configManager.writeConfig(cfg);

    return c.json({
        playerDataDelta: {
            modified: {
                homeTheme: {
                    selected: req.themeId,
                },
            },
            deleted: {},
        },
    });
}
