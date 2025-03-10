export async function updateConfig() {
    await updateNetworkConfig();
}

export async function updateNetworkConfig() {}

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
                pkgAd: string | null;
                pkgIOS: string | null;
                secure: boolean;
            };
        };
    };
}
