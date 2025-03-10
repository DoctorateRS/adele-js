import { Hono } from "hono";

export const app = new Hono();

app.notFound((c) => {
    return c.json({});
});
