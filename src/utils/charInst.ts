export class CharInstToCharInstId {
    dict: Record<string, string>;

    constructor() {
        this.dict = {};
    }

    get(idx: string) {
        return this.dict[idx];
    }

    set(idx: string, val: string) {
        this.dict[idx] = val;
    }
}

export default new CharInstToCharInstId();
