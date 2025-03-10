export function max(a: number, b: number) {
    return (a > b) ? a : b;
}

export function min(a: number, b: number) {
    return (a < b) ? a : b;
}

export function sumArr(n: number[]) {
    return n.reduce((a, b) => {
        return a + b;
    });
}

export function sum(...n: number[]) {
    return n.reduce((a, b) => {
        return a + b;
    });
}
