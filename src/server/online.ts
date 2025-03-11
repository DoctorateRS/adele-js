import { Context } from "hono";

export function onlineV1Ping(c: Context) {
    return c.json({
        alertTime: 600,
        interval: 3590,
        message: "OK",
        result: 0,
        timeLeft: -1,
    });
}

export function onlineV1LoginOut(c: Context) {
    return c.json({
        error: "Not Found",
        message: "Not Found",
        statusCode: 404,
    });
}
