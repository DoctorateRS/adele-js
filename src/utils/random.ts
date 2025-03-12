import { sort } from "./numbers.ts";

const charPool = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

export function getRandomName(len?: number) {
    return getRandomElements(charPool, len ? len : 8);
}

export function getRandomNumber(param1: number, param2?: number) {
    param2 = param2 ? param2 : 0;
    const [e, s] = sort(param1, param2);
    return Math.floor(Math.random() * (e - s) + s);
}

export function getRandomElement<T>(elems: string | T[]) {
    return elems[getRandomNumber(elems.length)];
}

export function getRandomElements<T>(elems: string | T[], amount: number): T[] | string {
    switch (typeof elems) {
        case "string": {
            let accum = "";

            while (accum.length < amount) {
                accum += getRandomElement(elems);
            }

            return accum;
        }
        default: {
            const accum = [];

            while (accum.length < amount) {
                accum.push(getRandomElement(elems));
            }

            return accum;
        }
    }
}

export function getRandomUniqueElements<T>(elems: T[], amount: number): T[] {
    const accum = [];

    while (accum.length < amount) {
        let elem = getRandomElement(elems);
        while (accum.includes(elem)) {
            elem = getRandomElement(elems);
        }

        accum.push(elem);
    }

    return accum;
}
