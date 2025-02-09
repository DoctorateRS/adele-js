import { Hono } from "hono";
import JsonUtils from "../utils/json.ts";
import DefaultExcelTableReader from "../utils/excel.ts";
import { charConfig } from "../settings.ts";
import { max, min } from "../utils/numbers.ts";

const account = new Hono();

const specialOperators = [
    "char_508_aguard",
    "char_509_acast",
    "char_510_amedic",
    "char_511_asnipe",
    "char_604_ccast",
    "char_603_csnipe",
    "char_600_cpione",
    "char_601_cguard",
    "char_607_cspec",
    "char_605_cmedic",
    "char_602_cdfend",
    "char_606_csuppo",
    "char_611_acnipe",
    "char_608_acpion",
    "char_612_accast",
    "char_614_acsupo",
    "char_615_acspec",
    "char_613_acmedc",
    "char_610_acfend",
    "char_609_acguad",
];

class Skill {
    skillId: string;
    unlock: 1;
    state: 0;
    specializeLevel: number;
    completeUpgradeTime: -1;

    constructor(skillId: string) {
        this.skillId = skillId;
    }
}

class Equip {
    hide: 0;
    locked: 0;
    level: number;

    constructor(level: number) {
        this.level = level;
    }
}

function createAmiyaSkill(...skills: string[]): Skill[] {
    return skills.map((s) => new Skill(s));
}

account.post("/login", async (c) => {
    interface Login {
        token: string;
    }

    const req = await c.req.json<Login>();
    return c.json({
        result: 0,
        uid: "123456789",
        secret: req.token,
        serviceLicenseVersion: 0,
        majorVersion: "354",
    });
});

account.post("/syncData", (c) => {
    const skinTable = DefaultExcelTableReader.skinTable();
    const characterTable = DefaultExcelTableReader.characterTable();
    const equipTable = DefaultExcelTableReader.uniequipTable();
    const battleEquipTable = DefaultExcelTableReader.battleEquipTable();
    const displayMetaTable = DefaultExcelTableReader.displayMetaTable();
    const retroTable = DefaultExcelTableReader.retroTable();
    const charmTable = DefaultExcelTableReader.charmTable();
    const activityTable = DefaultExcelTableReader.activityTable();
    const charWordTable = DefaultExcelTableReader.charwordTable();

    const ts = Date.now();
    let cnt = 0;
    let cntInstId = 1;
    let maxInstId = 1;
    const tempSkinTable = {};
    const myCharList = {};
    const charGroup = {};
    const buildingChars = {};

    const playerSyncData = JsonUtils.readJson("./resources/user/syncData.json");

    const skinKeys = Object.keys(skinTable.charSkins);
    playerSyncData.user.skin.characterSkins = {};

    for (const skinData of Object.values<object>(skinTable.charSkins)) {
        if (!skinKeys[cnt].includes("@")) {
            cnt += 1;
            continue;
        }

        playerSyncData.user.skin.characterSkins[skinKeys[cnt]] = 1;

        if (
            !Object.keys(tempSkinTable).includes(skinData.charId) ||
            skinData.displaySkin.onYear > skinTable.charSkins[tempSkinTable[skinData.charId]].displaySkin.onYear
        ) {
            tempSkinTable[skinData.charId] = skinData.skinId;
        }

        cnt += 1;
    }

    cnt = 0;
    const operatorKeys = Object.keys(characterTable);
    const equipKeys = Object.keys(equipTable.charEquip);

    for (const opKey of operatorKeys) {
        if (opKey.includes("char")) {
            charGroup[opKey] = { favorPoint: 25570 };
        }
    }

    for (const opKey of Object.keys(characterTable)) {
        if (!operatorKeys[cnt].includes("char")) {
            cnt = cnt + 1;
            continue;
        }

        const characterData = characterTable[opKey];

        let evolvePhase = charConfig.evolvePhase;
        let level = charConfig.level;

        if (charConfig.level < 0) {
            const phases = characterData.phases.length - 1;
            let phasesIndex: number;
            if (charConfig.evolvePhase < 0) {
                evolvePhase = phases;
                phasesIndex = phases;
            } else {
                evolvePhase = min(phases, charConfig.evolvePhase);
                phasesIndex = min(phases, charConfig.evolvePhase);
            }

            level = phases[phasesIndex];
        }

        cntInstId = parseInt(operatorKeys[cnt].split("_")[1]);
        maxInstId = max(cntInstId, maxInstId);
        let voiceLan = "JP";
        if (Object.keys(charWordTable.charDefaultTypeDict).includes(operatorKeys[cnt])) {
            voiceLan = charWordTable.charDefaultTypeDict[operatorKeys[cnt]];
        }

        const character = {
            instId: cntInstId,
            charId: operatorKeys[cnt],
            favorPoint: charConfig.favorPoint,
            potentialRank: charConfig.potentialRank,
            mainSkillLvl: charConfig.mainSkillLvl,
            skin: `${operatorKeys[cnt]}#1`,
            level: level,
            exp: 0,
            evolvePhase: evolvePhase,
            defaultSkillIndex: characterData.skills.length - 1,
            gainTime: ts,
            skills: [],
            voiceLan: voiceLan,
            currentEquip: null,
            equip: {},
            starMark: 0,
        };

        if (!specialOperators.includes(operatorKeys[cnt]) && character.evolvePhase == 2) {
            character.skin = `${operatorKeys[cnt]}#2`;
        }

        if (Object.keys(tempSkinTable).includes(operatorKeys[cnt])) {
            character.skin = tempSkinTable[operatorKeys[cnt]];
        }

        for (const idx in characterData.skills) {
            const skillData = characterData.skills[parseInt(idx)];

            const skill = new Skill(skillData.skillId);

            if (skillData.levelUpCostCond.length > 0) {
                skill.specializeLevel = charConfig.skillsSpecializeLevel;
            }

            character.skills.push(skill);
        }

        if (Object.keys(equipTable).includes(character.charId)) {
            let curEquip = null;
            for (const equip of equipTable.charEquip[character.charId]) {
                let level = 1;

                if (Object.keys(battleEquipTable).includes(equip)) {
                    level = battleEquipTable[equip].phases.length;
                }

                curEquip = equip;
                character.equip[equip] = new Equip(level);
            }

            character.currentEquip = curEquip;
        }

        playerSyncData.user.dexNav.character[operatorKeys[cnt]] = {
            charInstId: cntInstId,
            count: 6,
        };

        if (operatorKeys[cnt] == "char_002_amiya") {
            character.defaultSkillIndex = -1;
            character.skills = [];

            character.currentTmpl = "char_002_amiya";
            const tmpl = {
                "char_002_amiya": {
                    skinId: "char_002_amiya@test#1",
                    defaultSkillIndex: 2,
                    skills: createAmiyaSkill("skcom_magic_rage[3]", "skchr_amiya_2", "skchr_amiya_3"),
                    currentEquip: null,
                    equip: {},
                },
                "char_1001_amiya2": {
                    skinId: "char_1001_amiya2@casc#1",
                    defaultSkillIndex: 1,
                    skills: createAmiyaSkill("skchr_amiya2_1", "skchr_amiya2_2"),
                    currentEquip: null,
                    equip: {},
                },
                "char_1037_amiya3": {
                    skinId: "char_1037_amiya3#2",
                    defaultSkillIndex: 1,
                    skills: createAmiyaSkill("skchr_amiya3_1", "skchr_amiya3_2"),
                    currentEquip: null,
                    equip: {},
                },
            };

            for (const alter of ["char_002_amiya", "char_1001_amiya2", "char_1037_amiya3"]) {
                let curEquip = null;
                for (const equip of equipTable.charEquip[alter]) {
                    let level = 1;

                    if (Object.keys(battleEquipTable).includes(equip)) {
                        level = battleEquipTable[equip].phases.length;
                    }

                    curEquip = equip;
                    tmpl[alter].equip[equip] = new Equip(level);
                }

                tmpl[alter].currentEquip = curEquip;
            }

            character.tmpl = tmpl;
        }

        if (operatorKeys[cnt] == "char_512_aprot") {
            character.skin = "char_512_aprot#1";
        }

        myCharList[cntInstId.toString()] = character;
        cnt += 1;
    }
    cntInstId = 10000;

    playerSyncData.user.troop.chars = myCharList;
    playerSyncData.user.troop.charGroup = charGroup;
    playerSyncData.user.troop.curCharInstId = cntInstId;

    JsonUtils.writeJson("./resources/user/user.json", playerSyncData);
    return c.json(playerSyncData);
});

account.post("/syncStatus", (c) => {
    return c.json({ result: {} });
});

account.post("/syncPushMessage", (c) => {
    return c.json({});
});

export default account;
