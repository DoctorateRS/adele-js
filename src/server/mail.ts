import { Context } from "hono";
import mailsManager from "../utils/mail.ts";

export function mailGetMetaInfoList(c: Context) {
    const ts = Date.now();
    const mails = mailsManager.getMailsData();
    const result = [];

    for (const mailId of Object.keys(mails.mailList)) {
        if (mails.deletedIDs.includes(parseInt(mailId))) {
            continue;
        }

        result.push({
            "createAt": ts,
            "hasItem": 1,
            "mailId": mailId,
            "state": (mails.recievedIDs.includes(parseInt(mailId))) ? 1 : 0,
            "type": 1,
        });
    }

    return c.json({
        result: result,
        playerDataDelta: {
            modified: {},
            deleted: {},
        },
    });
}

export function mailListMailBox(c: Context) {
    const mails = mailsManager.getMailsData();
    let hasGift = 0;
}
