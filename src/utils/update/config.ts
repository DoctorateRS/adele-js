import cache from "../cache.ts";
import json from "../json.ts";
import { NetworkConfig, NetworkConfigContent, VersionConfig } from "./types.ts";

export async function updateConfig(): Promise<boolean> {
    cache.writeCache({ time: Date.now() }, "time");

    console.log("Getting new Version config...");
    const newVerCfg = await json.fetchJsonAs<VersionConfig>("https://ak-conf.hypergryph.com/config/prod/official/Android/version");

    console.log("Getting new Network config...");
    const newNetCfg = await json.fetchJsonAs<NetworkConfig>("https://ak-conf.hypergryph.com/config/prod/official/network_config");
    const newNetCfgCont: NetworkConfigContent = JSON.parse(newNetCfg.content);

    try {
        let flag = false;

        const oldVerCfg = cache.readVersionCache();
        const oldNetCfg = cache.readNetworkCacheContent();

        if (newVerCfg.clientVersion !== oldVerCfg.clientVersion || newVerCfg.resVersion !== oldVerCfg.resVersion) {
            cache.writeCache(newVerCfg, "version");
            flag = true;
        }

        if (oldNetCfg.content.funcVer !== newNetCfgCont.funcVer || oldNetCfg.content.configVer !== newNetCfgCont.configVer) {
            cache.writeCache({
                sign: newNetCfg.sign,
                content: {
                    configVer: newNetCfgCont.configVer,
                    funcVer: newNetCfgCont.funcVer,
                    configs: {
                        [newNetCfgCont.funcVer]: {
                            override: true,
                            network: {
                                gs: "{server}",
                                as: "{server}",
                                u8: "{server}/u8",
                                hu: "{server}/assetbundle/official",
                                hv: "{server}/config/prod/official/{0}/version",
                                rc: "{server}/config/prod/official/remote_config",
                                an: "{server}/config/prod/announce_meta/{0}/announcement.meta.json",
                                prean: "{server}/config/prod/announce_meta/{0}/preannouncement.meta.json",
                                sl: "https://ak.hypergryph.com/protocol/service",
                                of: "https://ak.hypergryph.com/index.html",
                                pkgAd: null,
                                pkgIOS: null,
                                secure: false,
                            },
                        },
                    },
                },
            }, "network");
            flag = true;
        }

        return flag;
    } catch {
        cache.writeCache(newVerCfg, "version");
        cache.writeCache({
            sign: newNetCfg.sign,
            content: {
                configVer: newNetCfgCont.configVer,
                funcVer: newNetCfgCont.funcVer,
                configs: {
                    [newNetCfgCont.funcVer]: {
                        override: true,
                        network: {
                            gs: "{server}",
                            as: "{server}",
                            u8: "{server}/u8",
                            hu: "{server}/assetbundle/official",
                            hv: "{server}/config/prod/official/{0}/version",
                            rc: "{server}/config/prod/official/remote_config",
                            an: "{server}/config/prod/announce_meta/{0}/announcement.meta.json",
                            prean: "{server}/config/prod/announce_meta/{0}/preannouncement.meta.json",
                            sl: "https://ak.hypergryph.com/protocol/service",
                            of: "https://ak.hypergryph.com/index.html",
                            pkgAd: null,
                            pkgIOS: null,
                            secure: false,
                        },
                    },
                },
            },
        }, "network");
        return true;
    }
}
