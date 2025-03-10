export class VersionConfig {
    resVersion: string;
    clientVersion: string;
}

export class NetworkConfig {
    sign: string;
    content: string;
}

export class NetworkConfigContent {
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
