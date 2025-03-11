import json from "./json.ts";

export class ExcelReader {
    json = json;
    basePath: string;

    constructor(basePath?: string) {
        this.basePath = basePath ? basePath : "./resources/excel/";
    }

    internal(name: string) {
        return this.json.readJson(`${this.basePath}/${name}`);
    }

    activityTable() {
        return this.internal("activity_table.json");
    }

    battleEquipTable() {
        return this.internal("battle_equip_table.json");
    }

    buildingTable() {
        return this.internal("building_data.json");
    }

    campaignTable() {
        return this.internal("campaign_table.json");
    }

    chapterTable() {
        return this.internal("chapter_table.json");
    }

    charMetaTable() {
        return this.internal("char_meta_table.json");
    }

    charPatchTable() {
        return this.internal("char_patch_table.json");
    }

    characterTable() {
        return this.internal("character_table.json");
    }

    charmTable() {
        return this.internal("charm_table.json");
    }

    charwordTable() {
        return this.internal("charword_table.json");
    }

    climbTowerTable() {
        return this.internal("climb_tower_table.json");
    }

    clueDataTable() {
        return this.internal("clue_data.json");
    }

    crisisTable() {
        return this.internal("crisis_table.json");
    }

    crisisV2Table() {
        return this.internal("crisis_v2_table.json");
    }

    displayMetaTable() {
        return this.internal("display_meta_table.json");
    }

    enemyHandbookTable() {
        return this.internal("enemy_handbook_table.json");
    }

    gachaTable() {
        return this.internal("gacha_table.json");
    }

    handbookInfoTable() {
        return this.internal("handbook_info_table.json");
    }

    handbookTeamTable() {
        return this.internal("handbook_team_table.json");
    }

    hotupdateMetaTable() {
        return this.internal("hotupdate_meta_table.json");
    }

    itemTable() {
        return this.internal("item_table.json");
    }

    medalTable() {
        return this.internal("medal_table.json");
    }

    missionTable() {
        return this.internal("mission_data.json");
    }

    retroTable() {
        return this.internal("retro_table.json");
    }

    roguelikeTopicTable() {
        return this.internal("roguelike_topic_table.json");
    }

    sandboxPermTable() {
        return this.internal("sandbox_perm_table.json");
    }

    sandboxTable() {
        return this.internal("sandbox_table.json");
    }

    shopClientTable() {
        return this.internal("shop_client_table.json");
    }

    skillTable() {
        return this.internal("skill_table.json");
    }

    skinTable() {
        return this.internal("skin_table.json");
    }

    stageTable() {
        return this.internal("stage_table.json");
    }

    storyReviewMetaTable() {
        return this.internal("story_review_meta_table.json");
    }

    storyReviewTable() {
        return this.internal("story_review_table.json");
    }

    storyTable() {
        return this.internal("story_table.json");
    }

    techBuffTable() {
        return this.internal("tech_buff_table.json");
    }

    tokenTable() {
        return this.internal("token_table.json");
    }

    uniequipTable() {
        return this.internal("uniequip_table.json");
    }
}

const excel = new ExcelReader();
export default excel;
