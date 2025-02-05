import { Hono } from "hono";
export const assetbundle = new Hono().basePath("/assetbundle/official/Android/assets");
function asset(c) {}
assetbundle.all("/:res_version/:asset_filename", asset);
