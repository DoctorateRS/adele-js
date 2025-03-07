import { Hono } from "hono";
import DefaultConfigManager from "../utils/config.ts";
import { serverConfig } from "../settings.ts";

export const configProd = new Hono();

configProd.get("/announce_meta/Android/preannouncement.meta.json", async (c) => {
    const announcement = await fetch(
        "https://ak-conf.hypergryph.com/config/prod/announce_meta/Android/preannouncement.meta.json",
    );

    return c.json(await announcement.json());
});

configProd.get("/announce_meta/Android/announcement.meta.json", async (c) => {
    const announcement = await fetch(
        "https://ak-conf.hypergryph.com/config/prod/announce_meta/Android/announcement.meta.json",
    );

    return c.json(await announcement.json());
});

configProd.get("/official/Android/version", (c) => {
    const version = DefaultConfigManager.readVersionConfig();
    return c.json(version["cn"]);
});

configProd.get("/official/network_config", (c) => {
    const network = DefaultConfigManager.readNetworkConfig();
    const serverUrl = `http://${serverConfig.host}:${serverConfig.port}`;

    const networkCn = network["cn"];
    const funcVer = networkCn.content.funcVer;

    for (const [k, v] of Object.entries(networkCn.content.configs[funcVer].network)) {
        if (typeof v === "string") {
            networkCn.content.configs[funcVer].network[k] = v.replace("{server}", serverUrl);
        }
    }

    return c.json({
        sign: networkCn.sign,
        content: JSON.stringify(networkCn.content),
    });
});

configProd.get("/official/refresh_config", (c) => {
    return c.json({
        resVersion: null,
    });
});

configProd.get("/official/remote_config", (c) => {
    return c.json({
        HGDownload_1: 10000,
        HGDownload_2: 10000,
        enableGameBI: true,
        enableMarquee: false,
        enableNavtieLicense: false,
        fapv2: 1,
    });
});

export const api = new Hono();

api.get("/gate/meta/Android", (c) => {
    return c.json({
        preAnnounceId: "478",
        actived: true,
        preAnnounceType: 2,
    });
});

api.get("/game/get_latest_game_info", (c) => {
    return c.json({
        version: "",
        action: 3,
        update_type: 0,
        update_info: {
            package: null,
            patch: null,
            custom_info: "",
            source_package: null,
        },
        client_version: "",
    });
});

api.get("/remote_config/101/prod/default/Android/ak_sdk_config", (c) => {
    return c.json({ report_device_info: 10000 });
});
