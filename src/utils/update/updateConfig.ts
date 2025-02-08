import JsonUtils from "../json.ts";
import oldVersionConfig from "../../../config/version.json" with { type: "json" };
import oldNetworkConfig from "../../../config/network.json" with { type: "json" };

async function updateConfig(): Promise<boolean> {
    let flag = false;
    const newVersionConfig = await JsonUtils.fetchJsonAs<VersionConfig>("https://ak-conf.hypergryph.com/config/prod/official/Android/version");

    if (oldVersionConfig.cn != newVersionConfig) {
        flag = true;
        JsonUtils.writeJson("./config/version.json", { cn: newVersionConfig, global: {} });
    }

    const newNetworkConfig = await JsonUtils.fetchJsonAs<NetworkConfig>("https://ak-conf.hypergryph.com/config/prod/official/network_config");
    const newNetworkConfigContent: NetworkConfigContent = JSON.parse(newNetworkConfig.content);

    if (
        oldNetworkConfig.cn.content.configVer != newNetworkConfigContent.configVer ||
        oldNetworkConfig.cn.content.funcVer != newNetworkConfigContent.funcVer
    ) {
        JsonUtils.writeJson("./config/network.json", {
            cn: {
                sign: "sign",
                content: {
                    configVer: newNetworkConfigContent.configVer,
                    funcVer: newNetworkConfigContent.funcVer,
                    configs: {
                        [newNetworkConfigContent.funcVer]: {
                            override: true,
                            network: {
                                "gs": "{server}",
                                "as": "{server}",
                                "u8": "{server}/u8",
                                "hu": "{server}/assetbundle/official",
                                "hv": "{server}/config/prod/official/{0}/version",
                                "rc": "{server}/config/prod/official/remote_config",
                                "an": "{server}/config/prod/announce_meta/{0}/announcement.meta.json",
                                "prean": "{server}/config/prod/announce_meta/{0}/preannouncement.meta.json",
                                "sl": "https://ak.hypergryph.com/protocol/service",
                                "of": "https://ak.hypergryph.com/index.html",
                                "pkgAd": null,
                                "pkgIOS": null,
                                "secure": false,
                            },
                        },
                    },
                },
            },
            global: {},
        });
    }

    return flag;
}

export default updateConfig;

interface VersionConfig {
    resVersion: string;
    clientVersion: string;
}

interface NetworkConfig {
    sign: string;
    content: string;
}

interface NetworkConfigContent {
    configVer: string;
    funcVer: string;
    configs: {
        [key: string]: {
            override: boolean;
            network: {
                gs: string;
                as: string;
                u8: string;
                hu: string;
                hv: string;
                rc: string;
                an: string;
                prean: string;
                sl: string;
                of: string;
                pkgAd: string | undefined | null;
                pkgIOS: string | undefined | null;
                secure: boolean;
            };
        };
    };
}
