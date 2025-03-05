import JsonUtils from "./json.ts";

export class ShopManager {
    json = JsonUtils;
    basePath: string;

    constructor(basePath?: string) {
        this.basePath = basePath ? basePath : "./resources/shop/";
    }

    getShopJson() {
        return this.json.readJson(`${this.basePath}shop.json`);
    }

    getTemplateShopJson() {
        return this.json.readJson(`${this.basePath}templateShop.json`);
    }

    getAllProductList() {
        return this.json.readJson(`${this.basePath}allProductList.json`);
    }
}

const DefaultShopManager = new ShopManager();
export default DefaultShopManager;
