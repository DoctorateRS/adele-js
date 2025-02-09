export function min(a: number, b: number): number {
    if (a < b) {
        return a;
    } else {
        return b;
    }
}

export function max(a: number, b: number): number {
    if (a > b) {
        return a;
    } else {
        return b;
    }
}

export function sum(arr: number[]): number {
    return arr.reduce((prev, cur) => {
        return prev + cur;
    });
}
