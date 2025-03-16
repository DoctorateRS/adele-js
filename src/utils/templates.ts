import json from "./json.ts";

export class TemplateManager {
    json = json;
    basePath: string;

    constructor(basePath: string = "./res/tmpl/") {
        this.basePath = basePath;
    }

    rlv2Tmpl() {
        return this.json.readJsonAs<Rlv2Game>(`${this.basePath}rlv2Tmpl.json`);
    }

    sandbox() {
        return this.json.readJson(`${this.basePath}sandboxTmpl.json`);
    }
}

export interface Rlv2Game {
    current: Rlv2GameCurrent;
    outer: { [key: string]: Rlv2GameOuter };
}

export interface Rlv2Relic {
}

export interface Rlv2GameCurrent {
    player: {
        state: "NONE" | "MONTH_TEAM" | "CHALLENGE" | "NORMAL";
        property: {
            exp: number;
            level: number;
            maxLevel: number;
            hp: {
                current: number;
                max: number;
            };
            gold: number;
            shield: number;
            capacity: number;
            population: {
                cost: number;
                max: number;
            };
            conPerfectBattle: number;
        };
        cursor: {
            zone: number;
            position: null;
        };
        trace: [];
        pending: [];
        status: {
            bankPut: number;
        };
        toEnding: string;
        chgEnding: false;
    };
    map: {
        zones: Record<string, {}>;
    };
    troop: {
        chars: {};
        expedition: [];
        expeditionDetails: {};
        expeditionReturn: null;
        hasExpeditionReturn: false;
    };
    inventory: {
        relic: Record<string, Rlv2Relic>;
        recruit: {};
        trap: null;
        consumable: {};
        exploreTool: {};
    };
    game: {
        mode: "NONE";
        predefined: null;
        theme: string;
        outer: {
            support: false;
        };
        start: number;
        modeGrade: number;
        equivalentGrade: number;
    };
    buff: {
        tmpHP: number;
        capsule: null;
        squadBuff: [];
    };
    record: {
        brief: null;
    };
    module: {};
}

export interface Rlv2GameOuter {
    bank: {
        show: boolean;
        current: number;
        record: number;
        totalPut: number;
        rewards: Record<string, number>;
    };
    bg: {
        point: number;
        reward: Record<string, number>;
    };
    buff: {
        pointOwned: number;
    };
}
