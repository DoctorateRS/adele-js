import { Context } from "hono";
import excel from "../utils/excel.ts";
import config from "../config/mod.ts";
import { max, min, repeat } from "../utils/numbers.ts";
import user from "../utils/userData.ts";

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

export async function accountLogin(c: Context) {
    const req = await c.req.json();
    return c.json({
        result: 0,
        uid: "123456789",
        secret: req.token,
        serviceLicenseVersion: 0,
        majorVersion: "354",
    });
}

export function accountSyncStatus(c: Context) {
    return c.json({
        ts: Date.now(),
        result: {},
        playerDataDelta: {
            modified: {},
            deleted: {},
        },
    });
}

export function accountSyncPushMsg(c: Context) {
    return c.json({
        code: 200,
        msg: "OK",
    });
}

export function accountSyncData(c: Context) {
    class Skill {
        skillId: string;
        unlock = 1;
        state = 0;
        specializeLevel: number;
        completeUpgradeTime = -1;

        constructor(skillId: string, specializeLevel: number) {
            this.skillId = skillId;
            this.specializeLevel = specializeLevel;
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

    interface SKinDisplayDetail {
        onYear: number;
    }

    interface SKinDetail {
        charId: string;
        skinId: string;
        displaySkin: SKinDisplayDetail;
    }

    function createSkills(level: number, ...skills: string[]) {
        return skills.map((v) => {
            return new Skill(v, level);
        });
    }

    const skinTable = excel.skinTable();
    const characterTable = excel.characterTable();
    const equipTable = excel.uniequipTable();
    const battleEquipTable = excel.battleEquipTable();
    const displayMetaTable = excel.displayMetaTable();
    const retroTable = excel.retroTable();
    const charmTable = excel.charmTable();
    const activityTable = excel.activityTable();
    const charWordTable = excel.charwordTable();

    const ts = Date.now();
    let cnt = 0;
    let cntInstId = 1;
    let maxInstId = 1;
    const tempSkinTable = {};
    const myCharList = {};
    const charGroup = {};
    const buildingChars = {};

    const playerSyncData = user.readSyncData();

    if (!Object.hasOwn(playerSyncData, "charRotation")) {
        playerSyncData.user.charRotation = {
            current: "1",
            preset: {
                "1": {
                    background: "bg_rhodes_day",
                    homeTheme: "tm_rhodes_day",
                    name: "OSX",
                    profile: "char_171_bldsk@witch#1",
                    profileInst: "171",
                    slots: [
                        {
                            charId: "char_171_bldsk",
                            skinId: "char_171_bldsk@witch#1",
                        },
                    ],
                },
            },
        };
    }

    const skinKeys = Object.keys(skinTable.charSkins);
    playerSyncData.user.skin.characterSkins = {};

    for (const skinData of Object.values<SKinDetail>(skinTable.charSkins)) {
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

        const charConfig = config.char;

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

            const level = (character.evolvePhase === 2) ? 3 : 0;
            const skill = new Skill(skillData.skillId, level);

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

            character["currentTmpl"] = "char_002_amiya";
            const tmpl = {
                "char_002_amiya": {
                    skinId: "char_002_amiya@test#1",
                    defaultSkillIndex: 2,
                    skills: createSkills(3, "skcom_magic_rage[3]", "skchr_amiya_2", "skchr_amiya_3"),
                    currentEquip: null,
                    equip: {},
                },
                "char_1001_amiya2": {
                    skinId: "char_1001_amiya2@casc#1",
                    defaultSkillIndex: 1,
                    skills: createSkills(3, "skchr_amiya2_1", "skchr_amiya2_2"),
                    currentEquip: null,
                    equip: {},
                },
                "char_1037_amiya3": {
                    skinId: "char_1037_amiya3#2",
                    defaultSkillIndex: 1,
                    skills: createSkills(3, "skchr_amiya3_1", "skchr_amiya3_2"),
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

            character["tmpl"] = tmpl;
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

    const storyList = { ["init"]: 1 };
    for (const story of Object.keys(excel.storyTable())) {
        storyList[story] = 1;
    }

    const stageList = {};
    const stageTable = excel.stageTable();
    playerSyncData.user.status.flags = storyList;
    for (const stage of Object.keys(stageTable.stages)) {
        if (stage.startsWith("camp")) {
            playerSyncData.user.campaignsV2.open.permanent.push(stage);
            playerSyncData.user.campaignsV2.open.training.push(stage);
            playerSyncData.user.campaignsV2.sweepMaxKills[stage] = 400;
            playerSyncData.user.campaignsV2.instances[stage] = {
                maxKills: 400,
                rewardStatus: [1, 1, 1, 1, 1, 1, 1, 1],
            };
        }

        stageList[stage] = {
            completeTimes: 1,
            hasBattleReplay: 0,
            noCostCnt: 0,
            practiceTimes: 0,
            stageId: stageTable.stages[stage].stageId,
            startTimes: 1,
            state: 3,
        };
    }

    playerSyncData.user.dungeon.stages = stageList;

    const addonList = {};
    const addonTable = excel.handbookInfoTable();

    for (const charId of Object.keys(addonTable.handbookDict)) {
        const charStoryList = { story: {} };
        const story = addonTable.handbookDict[charId].handbookAvgList;

        let cnt = 0;
        for (const storySet of story) {
            if (Object.hasOwn(storySet, "storySetId")) {
                charStoryList.story[storySet.storySetId] = { fts: ts, rts: ts };
            }

            cnt += 1;
        }

        addonList[charId] = charStoryList;
    }

    for (const stageId of Object.keys(addonTable.handbookStageData)) {
        if (!Object.hasOwn(addonList[stageId], "stage")) {
            addonList[stageId].stage = {};
        }

        addonList[stageId].stage[addonTable.handbookStageData[stageId].stageId] = {
            startTimes: 0,
            completeTimes: 1,
            state: 3,
            fts: ts,
            rts: ts,
            startTime: 2,
        };
    }

    playerSyncData.user.troop.addon = addonList;

    const block = {};
    for (const retro of Object.keys(retroTable.retroActList)) {
        block[retro] = {
            locked: 0,
            open: 1,
        };
    }

    playerSyncData.user.retro.block = block;

    const trail = {};
    for (const retro of Object.keys(retroTable.retroTrailList)) {
        for (const trailReward of retroTable.retroTrailList[retro].trailRewardList) {
            trail[retro] = {
                [trailReward.trailRewardId]: 1,
            };
        }
    }

    playerSyncData.user.retro.trail = trail;

    const avatarIcons = {};
    for (const avatar of displayMetaTable.playerAvatarData.avatarList) {
        avatarIcons[avatar.avatarId] = {
            ts,
            src: (avatar.avatarId.startsWith("avatar_def") ? "start" : "other"),
        };
    }

    playerSyncData.user.avatar.avatar_icon = avatarIcons;

    const bgs = {};
    for (const bg of displayMetaTable.homeBackgroundData.homeBgDataList) {
        bgs[bg.bgID] = { unlock: ts };
    }

    playerSyncData.user.background.bgs = bgs;

    const themes = {};
    for (const theme of displayMetaTable.homeBackgroundData.themeList) {
        themes[theme.id] = { unlock: ts };
    }

    playerSyncData.user.homeTheme.themes = themes;

    const charms = {};
    for (const charm of charmTable.charmList) {
        charms[charm.id] = 1;
    }

    playerSyncData.user.charm.charms = charms;

    for (const carGear in activityTable.carData.carDict) {
        playerSyncData.user.car.accessories[carGear] = {
            id: carGear,
            num: activityTable.carData.carDict[carGear].posList.length,
        };
    }

    const deepSeaData = activityTable.activity["TYPE_ACT17SIDE"]["act17side"];

    for (const place in deepSeaData.placeDataMap) {
        playerSyncData.user.deepSea.places[place] = 2;
    }

    for (const node in deepSeaData.nodeInfoDataMap) {
        playerSyncData.user.deepSea.nodes[node] = 2;
    }

    for (const choice in deepSeaData.choiceNodeDataMap) {
        playerSyncData.user.deepSea.choices[choice] = repeat([2], deepSeaData.choiceNodeDataMap[choice].optionList.length);
    }

    for (const event in deepSeaData.eventDataMap) {
        playerSyncData.user.deepSea.events[event] = 1;
    }

    for (const treasure in deepSeaData.treasureNodeDataMap) {
        playerSyncData.user.deepSea.treasures[treasure] = 1;
    }

    user.writeUserData(playerSyncData);
    return c.json(playerSyncData);
}

export function accountYostarAuthRequest(c: Context) {
    return c.json({});
}

export function accountYostarAuthSubmit(c: Context) {
    return c.json({
        result: 0,
        yostar_account: "1234567890@123.com",
        yostar_token: "a",
        yostar_uid: "10000023",
    });
}
