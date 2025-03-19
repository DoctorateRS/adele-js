export function sort(a: number, b: number): [number, number] {
    return (a > b) ? [a, b] : [b, a];
}

export function repeat<T>(arr: T[], times: number): T[] {
    const collector = [];

    for (const _ of range(times)) {
        collector.push(...arr);
    }

    return collector;
}

export function max(a: number, b: number) {
    return (a > b) ? a : b;
}

export function min(a: number, b: number) {
    return (a < b) ? a : b;
}

export function sum(...n: number[]) {
    return n.reduce((a, b) => {
        return a + b;
    });
}

export function range(ptr1: number, ptr2?: number, step?: number) {
    return new NumberIterator(ptr1, ptr2, step);
}

export class NumberIterator implements Iterable<number> {
    start: number;
    end: number;
    step: number;

    constructor(f1: number, f2?: number, step?: number) {
        if (f2 !== undefined) {
            this.end = f2;
            this.start = f1;
        } else {
            this.start = 0;
            this.end = f1;
        }

        this.step = step ? step : 1;
    }

    *[Symbol.iterator](): IterableIterator<number> {
        let cnt = this.start;
        while (cnt < this.end) {
            yield cnt;
            cnt += this.step;
        }
    }
}
