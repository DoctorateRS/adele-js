import json from "./json.ts";

export class ShopManager {
    basePath: string;
    json = json;

    constructor(basePath: string = "./res/shop/") {
        this.basePath = basePath;
    }

    shop() {
        return this.json.readJson(`${this.basePath}shop.json`);
    }

    templateShop() {
        return this.json.readJson(`${this.basePath}templateShop.json`);
    }

    allProductList() {
        return this.json.readJson(`${this.basePath}allProductList.json`);
    }
}

const shop = new ShopManager();
export default shop;
