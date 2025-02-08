import JsonUtils from "./json.ts";

const baseUrl = "https://raw.githubusercontent.com/Kengxxiao/ArknightsGameData/master/zh_CN/gamedata/excel/";

const excelFiles = [
    "activity_table.json",
    "audio_data.json",
    "battle_equip_table.json",
    "building_data.json",
    "campaign_table.json",
    "chapter_table.json",
    "char_meta_table.json",
    "char_patch_table.json",
    "character_table.json",
    "charm_table.json",
    "charword_table.json",
    "checkin_table.json",
    "climb_tower_table.json",
    "clue_data.json",
    "crisis_table.json",
    "crisis_v2_table.json",
    "display_meta_table.json",
    "enemy_handbook_table.json",
    "favor_table.json",
    "gacha_table.json",
    "gamedata_const.json",
    "handbook_info_table.json",
    "handbook_table.json",
    "handbook_team_table.json",
    "hotupdate_meta_table.json",
    "item_table.json",
    "medal_table.json",
    "mission_table.json",
    "open_server_table.json",
    "player_avatar_table.json",
    "range_table.json",
    "replicate_table.json",
    "retro_table.json",
    "roguelike_table.json",
    "roguelike_topic_table.json",
    "sandbox_perm_table.json",
    "sandbox_table.json",
    "shop_client_table.json",
    "skill_table.json",
    "skin_table.json",
    "stage_table.json",
    "story_review_meta_table.json",
    "story_review_table.json",
    "story_table.json",
    "tech_buff_table.json",
    "tip_table.json",
    "token_table.json",
    "uniequip_data.json",
    "uniequip_table.json",
    "zone_table.json",
];

async function updateExcel(): Promise<void> {
    for (const excel of excelFiles) {
        JsonUtils.writeJson(`./resources/excel/${excel}`, await JsonUtils.fetchJson(`${baseUrl}${excel}`));
    }
}

export default updateExcel;
