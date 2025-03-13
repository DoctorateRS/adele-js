import { Hono } from "hono";
import { logger } from "hono/logger";

import {
    account,
    assets,
    background,
    building,
    campaignV2,
    char,
    charBuild,
    charm,
    charRotation,
    config,
    crisis,
    deepSea,
    online,
    pay,
    quest,
    social,
    story,
    templateShop,
    user,
} from "./server/mod.ts";
import { jsonLogger } from "./utils/json.ts";

export const app = new Hono();

app.use(logger(), jsonLogger);

app.post("/app/getSettings", user.appGetSettings);
app.post("/app/getCode", user.appGetCode);
app.post("/account/login", account.accountLogin);
app.post("/account/syncData", account.accountSyncData);
app.post("/account/syncStatus", account.accountSyncStatus);
app.post("/account/yostar_auth_request", account.accountYostarAuthRequest);
app.post("/account/yostar_auth_submit", account.accountYostarAuthSubmit);
app.post("/account/syncPushMessage", account.accountSyncPushMsg);

app.get("/assetbundle/official/Android/assets/:hash/:name", assets.downloadAsset);

app.post("/background/setBackground", background.setBackground);
app.post("/homeTheme/change", background.setTheme);

app.post("/building/sync", building.sync);
app.post("/building/getRecentVisitors", building.getRecentVisitor);
app.post("/building/getInfoShareVisitorsNum", building.getShareVisitorNum);
app.post("/building/assignChar", building.assignChar);
app.post("/building/changeDiySolution", building.changeDiySolution);
// app.post("/building/changeManufactureSolution", building.changeManufactureSolution);
// app.post("/building/settleManufacture", building.settleManufacture);
// app.post("/building/workshopSynthesis", building.workshopSynthesis);
// app.post("/building/upgradeSpecialization", building.upgradeSpecialization);
// app.post("/building/completeUpgradeSpecialization", building.completeUpgradeSpecialization);
// app.post("/building/deliveryOrder", building.DeliveryOrder);
// app.post("/building/deliveryBatchOrder", building.DeliveryBatchOrder);
// app.post("/building/cleanRoomSlot", building.CleanRoomSlot);
// app.post("/building/getAssistReport", building.getAssistReport);
// app.post("/building/setBuildingAssist", building.setBuildingAssist);
// app.post("/building/degradeRoom", building.changRoomLevel);
// app.post("/building/upgradeRoom", building.changRoomLevel);
// app.post("/building/changeStrategy", building.changeStrategy);
// app.post("/building/addPresetQueue", building.addPresetQueue);
// app.post("/building/deletePresetQueue", building.deletePresetQueue);
// app.post("/building/editPresetQueue", building.editPresetQueue);
// app.post("/building/usePresetQueue", building.usePresetQueue);
// app.post("/building/editLockQueue", building.editLockQueue);
// app.post("/building/batchRestChar", building.batchRestChar);
// app.post("/building/buildRoom", building.buildRoom);
// app.post("/building/setPrivateDormOwner", building.setPrivateDormOwner);

app.post("/campaignV2/battleStart", campaignV2.campaignV2BattleStart);
app.post("/campaignV2/battleFinish", campaignV2.campaignV2BattleFinish);
app.post("/campaignV2/battleSweep", campaignV2.campaignV2BattleSweep);

app.post("/char/changeMarkStar", char.charChangeMarkStar);

app.post("/charBuild/addonStage/battleStart", quest.questBattleStart);
app.post("/charBuild/addonStage/battleFinish", quest.questBattleFinish);
app.post("/charBuild/addonStory/unlock", charBuild.charBuildaddonStoryUnlock);
app.post("/charBuild/batchSetCharVoiceLan", charBuild.charBuildBatchSetCharVoiceLan);
app.post("/charBuild/setCharVoiceLan", charBuild.charBuildSetCharVoiceLan);
app.post("/charBuild/setDefaultSkill", charBuild.charBuildSetDefaultSkill);
app.post("/charBuild/changeCharSkin", charBuild.charBuildChangeCharSkin);
app.post("/charBuild/setEquipment", charBuild.charBuildSetEquipment);
app.post("/charBuild/changeCharTemplate", charBuild.charBuildChangeCharTemplate);

app.post("/charRotation/setCurrent", charRotation.setCurrent);
app.post("/charRotation/createPreset", charRotation.createPreset);
app.post("/charRotation/deletePreset", charRotation.deletePreset);
app.post("/charRotation/updatePreset", charRotation.updatePreset);

app.post("/charm/setSquad", charm.charmSetSquad);

app.get("/config/prod/announce_meta/Android/preannouncement.meta.json", config.prodPreAnnouncement);
app.get("/config/prod/announce_meta/Android/announcement.meta.json", config.prodAnnouncement);
app.get("/config/prod/official/Android/version", config.prodAndroidVersion);
app.get("/config/prod/official/network_config", config.prodNetworkConfig);
app.get("/config/prod/official/refresh_config", config.prodRefreshVersion);
app.get("/config/prod/official/remote_config", config.prodRemoteConfig);
app.get("/api/game/get_latest_game_info", config.getLatestGameInfo);
app.get("/api/gate/meta/Android", config.prodGateMeta);
app.get("/api/remote_config/101/prod/default/Android/ak_sdk_config", config.akSdkConfig);

app.post("/crisisV2/getInfo", crisis.crisisV2GetInfo);
app.post("/crisisV2/confirmMissions", crisis.crisisV2ConfirmMissions);
app.post("/crisisV2/battleStart", crisis.crisisV2BattleStart);
app.post("/crisisV2/battleFinish", crisis.crisisV2BattleFinish);
app.post("/crisisV2/getSnapshot", crisis.crisisV2GetSnapshot);
app.post("/crisisV2/getGoodList", crisis.crisisV2GetGoodList);

app.post("/deepSea/branch", deepSea.deepSeaBranch);
app.post("/deepSea/event", deepSea.deepSeaEvent);

// app.post("/mail/getMetaInfoList", mail.mailGetMetaInfoList);
// app.post("/mail/listMailBox", mail.mailListMailBox);
// app.post("/mailCollection/getList", mail.mailCollectionGetList);
// app.post("/mail/receiveMail", mail.mailReceiveMail);
// app.post("/mail/receiveAllMail", mail.mailReceiveAllMail);
// app.post("/mail/removeAllReceivedMail", mail.mailRemoveAllReceivedMail);

app.post("/online/v1/ping", online.onlineV1Ping);
app.post("/online/v1/loginout", online.onlineV1LoginOut);
app.post("/user/online/v1/loginout", online.onlineV1LoginOut);

// app.post("/tower/createGame", tower.towerCreateGame);
// app.post("/tower/initGodCard", tower.towerInitGodCard);
// app.post("/tower/initGame", tower.towerInitGame);
// app.post("/tower/initCard", tower.towerInitCard);
// app.post("/tower/battleStart", tower.towerBattleStart);
// app.post("/tower/battleFinish", tower.towerBattleFinish);
// app.post("/tower/recruit", tower.towerRecruit);
// app.post("/tower/chooseSubGodCard", tower.towerChooseSubGodCard);
// app.post("/tower/settleGame", tower.towerSettleGame);

app.post("/pay/getUnconfirmedOrderIdList", pay.getUnconfirmedOrderIdList);
app.post("/u8/pay/getAllProductList", pay.getAllProductList);
app.post("/pay/createOrder", pay.getCreateOrder);
app.post("/pay/v1/query_show_app_product", pay.queryShowAppProduct);
app.get("/user/pay/v1/query_payment_config", pay.queryPaymentConfig);
app.post("/user/pay/order/v1/create/app_product/alipay", pay.alipay);
app.post("/user/pay/order/v1/create/app_product/wechat", pay.wechat);
app.post("/pay/order/v1/check", pay.check);
app.get("/pay/order/v1/state", pay.state);

app.post("/quest/battleStart", quest.questBattleStart);
app.post("/quest/battleFinish", quest.questBattleFinish);
// app.post("/quest/saveBattleReplay", quest.questSaveBattleReplay);
// app.post("/quest/getBattleReplay", quest.questGetBattleReplay);
// app.post("/quest/changeSquadName", quest.questChangeSquadName);
// app.post("/quest/squadFormation", quest.questSquadFormation);
// app.post("/quest/getAssistList", quest.questGetAssistList);
// app.post("/quest/battleContinue", quest.questBattleContinue);
// app.post("/storyreview/markStoryAcceKnown", quest.markStoryAcceKnown);
// app.post("/storyreview/readStory", quest.readStory);
app.post("/act25side/battleStart", quest.questBattleStart);
app.post("/act25side/battleFinish", quest.questBattleFinish);
// app.post("/car/confirmBattleCar", quest.confirmBattleCar);
// app.post("/templateTrap/setTrapSquad", quest.setTrapSquad);
app.post("/activity/act24side/battleStart", quest.questBattleStart);
app.post("/activity/act24side/battleFinish", quest.questBattleFinish);
// app.post("/activity/act24side/setTool", quest.setTool);
app.post("/activity/bossRush/battleStart", quest.questBattleStart);
app.post("/activity/bossRush/battleFinish", quest.questBattleFinish);
// app.post("/activity/bossRush/relicSelect", quest.relicSelect);
// app.post("/retro/typeAct20side/competitionStart", quest.typeAct20side_competitionStart);
// app.post("/retro/typeAct20side/competitionFinish", quest.typeAct20side_competitionFinish);

// app.post("/rlv2/giveUpGame", rlv2.rlv2GiveUpGame);
// app.post("/rlv2/createGame", rlv2.rlv2CreateGame);
// app.post("/rlv2/chooseInitialRelic", rlv2.rlv2ChooseInitialRelic);
// app.post("/rlv2/selectChoice", rlv2.rlv2SelectChoice);
// app.post("/rlv2/chooseInitialRecruitSet", rlv2.rlv2ChooseInitialRecruitSet);
// app.post("/rlv2/activeRecruitTicket", rlv2.rlv2ActiveRecruitTicket);
// app.post("/rlv2/recruitChar", rlv2.rlv2RecruitChar);
// app.post("/rlv2/closeRecruitTicket", rlv2.rlv2CloseRecruitTicket);
// app.post("/rlv2/finishEvent", rlv2.rlv2FinishEvent);
// app.post("/rlv2/moveAndBattleStart", rlv2.rlv2MoveAndBattleStart);
// app.post("/rlv2/battleFinish", rlv2.rlv2BattleFinish);
// app.post("/rlv2/finishBattleReward", rlv2.rlv2FinishBattleReward);
// app.post("/rlv2/moveTo", rlv2.rlv2MoveTo);
// app.post("/rlv2/buyGoods", rlv2.rlv2BuyGoods);
// app.post("/rlv2/leaveShop", rlv2.rlv2LeaveShop);
// app.post("/rlv2/chooseBattleReward", rlv2.rlv2ChooseBattleReward);
// app.post("/rlv2/shopAction", rlv2.rlv2shopAction);

// app.post("/shop/getGoodPurchaseState", shop.getGoodPurchaseState);
// app.post("/shop/get<string:shop_type>GoodList", shop.getShopGoodList);
// app.post("/shop/buySkinGood", shop.buySkinGood);
// app.post("/shop/buyLowGood", shop.buyLowGood);
// app.post("/shop/buyHighGood", shop.buyHighGood);
// app.post("/shop/buyExtraGood", shop.buyExtraGood);
// app.post("/shop/buyClassicGood", shop.buyClassicGood);
// app.post("/shop/buyFurniGood", shop.buyFurniGood);
// app.post("/shop/buyFurniGroup", shop.buyFurniGroup);

app.post("/templateShop/getGoodList", templateShop.getGoodList);
app.post("/templateShop/BuyGood", templateShop.buyGood);

app.post("/story/finishStory", story.storyFinishStory);
app.post("/quest/finishStoryStage", story.storyFinishStory);

app.post("/user/bindBirthday", user.bindBirthday);
app.post("/user/auth", user.auth);
app.get("/user/agreement", user.agreement);
app.post("/user/checkIn", user.checkIn);
app.post("/user/changeSecretary", user.changeSecretary);
app.post("/user/login", user.login);
app.post("/user/changeAvatar", user.changeAvatar);
app.post("/user/oauth2/v1/grant", user.oauthV2Grant);
app.post("/user/info/v1/need_cloud_auth", user.v1NeedCloudAuth);
app.post("/user/yostar_createlogin", user.yostarCreateLogin);
app.post("/u8/user/v1/getToken", user.v1GetToken);
app.post("/user/changeResume", user.changeResume);
app.post("/businessCard/changeNameCardComponent", user.changeNamecardComponent);
app.post("/businessCard/changeNameCardSkin", user.changeNamecardSkin);
app.post("/businessCard/getOtherPlayerNameCard", user.getOtherPlayerNameCard);
app.post("/businessCard/editNameCard", user.editNameCard);

// app.post("/sandboxPerm/sandboxV2/createGame", sandbox.createGame);
// app.post("/sandboxPerm/sandboxV2/battleStart", sandbox.battleStart);
// app.post("/sandboxPerm/sandboxV2/battleFinish", sandbox.battleFinish);
// app.post("/sandboxPerm/sandboxV2/settleGame", sandbox.settleGame);
// app.post("/sandboxPerm/sandboxV2/eatFood", sandbox.eatFood);
// app.post("/sandboxPerm/sandboxV2/setSquad", sandbox.setSquad);
// app.post("/sandboxPerm/sandboxV2/homeBuildSave", sandbox.homeBuildSave);
// app.post("/sandboxPerm/sandboxV2/exploreMode", sandbox.exploreMode);
// app.post("/sandboxPerm/sandboxV2/eventChoice", sandbox.eventChoice);
// app.post("/sandboxPerm/sandboxV2/monthBattleStart", sandbox.monthBattleStart);
// app.post("/sandboxPerm/sandboxV2/monthBattleFinish", sandbox.monthBattleFinish);

// app.post("/gacha/normalGacha", gacha.normalGacha);
// app.post("/gacha/boostNormalGacha", gacha.boostNormalGacha);
// app.post("/gacha/finishNormalGacha", gacha.finishNormalGacha);
// app.post("/gacha/syncNormalGacha", gacha.syncNormalGacha);
// app.post("/gacha/getPoolDetail", gacha.getPoolDetail);
// app.post("/gacha/advancedGacha", gacha.advancedGacha);
// app.post("/gacha/tenAdvancedGacha", gacha.tenAdvancedGacha);
// app.post("/gacha/choosePoolUp", gacha.choosePoolUp);
// app.get("/gacha", gacha.gacha);
// app.get("/api/gacha/cate", gacha.cate);
// app.get("/api/is/rogue_1/bulletinVersion", gacha.bulletinVersion);
// app.get("/api/gacha/history", gacha.history);

app.post("/social/setAssistCharList", social.setAssistCharList);
app.post("/social/getSortListInfo", social.getSortListInfo);
app.post("/social/getFriendList", social.getFriendList);
app.post("/social/getFriendRequestList", social.getFriendRequestList);
app.post("/social/processFriendRequest", social.processFriendRequest);
app.post("/social/sendFriendRequest", social.sendFriendRequest);
app.post("/social/setFriendAlias", social.setFriendAlias);
app.post("/social/deleteFriend", social.deleteFriend);
app.post("/social/searchPlayer", social.searchPlayer);
app.post("/social/setCardShowMedal", social.setCardShowMedal);

app.post("/user/auth/v1/token_by_phone_password", user.authV1TokenByPhonePassword);
app.get("/user/info/v1/basic", user.v1InfoBasic);
app.post("/user/oauth2/v2/grant", user.oauth2V2Grant);
app.get("/app/v1/config", user.appV1Config);
app.get("/general/v1/server_time", user.generalV1ServerTime);
app.get("/u8/user/auth/v1/agreement_version", user.agreementVersion);

app.notFound((c) => {
    return c.json({
        playerDataDelta: {
            modified: {},
        },
    });
});
