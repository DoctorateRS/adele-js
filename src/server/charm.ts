import { Context } from "hono";
import user from "../utils/userData.ts";

export async function charmSetSquad(c: Context) {
    const { squad } = await c.req.json();

    const userData = user.readUserData();
    userData.user.charm.squad = squad;
    user.writeUserData(userData);

    return c.json({
        playerDataDelta: {
            deleted: {},
            modified: {
                charm: {
                    squad: squad,
                },
            },
        },
    });
}
