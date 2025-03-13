export class Option<T> {
    data: T | null;

    constructor(data?: T) {
        this.data = data ? data : null;
    }

    isNone() {
        return this.data === null;
    }

    isSome() {
        return this.data !== null;
    }

    extract() {
        if (this.isNone()) {
            throw new Error("Unwrapping a None");
        }

        return this.data;
    }

    map<U>(fn: (a: T) => U) {
        if (this.isSome()) {
            return new Option(fn(this.data));
        }
    }
}

export class Result<T> {
    data: Option<T>;
    err: Option<string>;

    constructor(data?: T, err?: string) {
        const maybeData = new Option(data);
        const maybeErr = new Option(err);

        if (maybeData.isSome() && maybeErr.isSome()) {
            throw new Error("Both values are present");
        }

        if (maybeData.isNone() && maybeErr.isNone()) {
            throw new Error("Neither values are present");
        }

        this.data = maybeData;
        this.err = maybeErr;
    }
}
