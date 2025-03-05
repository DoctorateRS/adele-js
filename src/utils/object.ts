function combineObjects(...objects: object[]): object {
    const obj = {};

    for (const object of objects) {
        for (const [k, v] of Object.entries(object)) {
            obj[k] = v;
        }
    }

    return obj;
}
