import { Context } from "hono";

import config from "../config/mod.ts";

import cache from "../utils/cache.ts";
import json from "../utils/json.ts";

export async function prodPreAnnouncement(c: Context) {
    return c.json(await json.fetchJson("https://ak-conf.hypergryph.com/config/prod/announce_meta/Android/preannouncement.meta.json"));
}

export async function prodAnnouncement(c: Context) {
    return c.json(await json.fetchJson("https://ak-conf.hypergryph.com/config/prod/announce_meta/Android/announcement.meta.json"));
}

export function prodRefreshVersion(c: Context) {
    return c.json({
        resVersion: null,
    });
}

export function prodAndroidVersion(c: Context) {
    const ver = cache.readVersionCache();
    return c.json(ver);
}

export function prodNetworkConfig(c: Context) {
    const serverUrl = `http://${config.server.host}:${config.server.port}`;
    const networkConfig = cache.readNetworkCacheContent();
    const funcVer = networkConfig.content.funcVer;

    for (const key of Object.keys(networkConfig.content.configs[funcVer].network)) {
        const url = networkConfig.content.configs[funcVer].network[key];

        if (typeof url === "string") {
            networkConfig.content.configs[funcVer].network[key] = url.replace("{server}", serverUrl);
        }
    }

    return c.json({
        sign: networkConfig.sign,
        content: json.dumpJson(networkConfig.content, ""),
    });
}

export function prodRemoteConfig(c: Context) {
    return c.json({
        HGDownload_1: 10000,
        HGDownload_2: 10000,
        enableGameBI: true,
        enableMarquee: false,
        enableNavtieLicense: false,
        fapv2: 1,
    });
}

export function prodGateMeta(c: Context) {
    return c.json({
        preAnnounceId: "478",
        actived: true,
        preAnnounceType: 2,
    });
}

export function getLatestGameInfo(c: Context) {
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
        client_version: null,
    });
}

export function akSdkConfig(c: Context) {
    return c.json({ report_device_info: 10000 });
}
