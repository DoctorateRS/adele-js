import settings from "../config/config.json" with { type: "json" };

export const serverConfig = settings.server;
export const assetsConfig = settings.assets;
export const charConfig = settings.charConfig;

export default settings;
