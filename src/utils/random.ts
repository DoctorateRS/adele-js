import { sort } from "./numbers.ts";

export class Random {
    constructor() {}

    getRandomNumber(param1: number, param2: number = 0) {
        const [e, s] = sort(param1, param2);
        return Math.floor(Math.random() * (e - s) + s);
    }

    getRandomElement<T>(elems: T[]) {
        return elems[this.getRandomNumber(elems.length)];
    }

    getRandomElements<T>(elems: T[], amount: number): T[] {
        const accum = [];

        while (accum.length < amount) {
            accum.push(this.getRandomElement(elems));
        }

        return accum;
    }

    getRandomUniqueElements<T>(elems: T[], amount: number): T[] {
        const accum = [];

        while (accum.length < amount) {
            let elem = this.getRandomElement(elems);
            while (accum.includes(elem)) {
                elem = this.getRandomElement(elems);
            }

            accum.push(elem);
        }

        return accum;
    }
}

export const random = new Random();

export class RandomStringGenerator {
    readonly fullCharPool = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
    readonly charPool = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZ";
    readonly numPool = "0123456789";
    random = random;

    constructor() {}

    generateString(len: number = 8, pool: "Full" | "Uppercase" | "Number" = "Full") {
        let localPool = "";

        switch (pool) {
            case "Full":
                localPool = this.fullCharPool;
                break;
            case "Uppercase":
                localPool = this.charPool;
                break;
            case "Number":
                localPool = this.numPool;
                break;
        }

        let str = "";

        for (let cnt = 0; cnt < len; cnt++) {
            str += localPool[this.random.getRandomNumber(localPool.length)];
        }

        return str;
    }
}

export const randomString = new RandomStringGenerator();
