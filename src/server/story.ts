import { Context } from "hono";
import { defaultPlayerDataDelta } from "../utils/mod.ts";

export function storyFinishStory(c: Context) {
    return c.json(defaultPlayerDataDelta);
}
