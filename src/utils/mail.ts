import json from "./json.ts";

export class MailManager {
    json = json;
    basePath: string;

    constructor(basePath?: string) {
        this.basePath = basePath ? basePath : "./res/user/mails.json";
    }

    getMailsData() {
        return this.json.readJsonAs<MailInst>(this.basePath);
    }

    writeMailsData(mails: MailInst) {
        this.json.writeJson(mails, this.basePath);
    }
}

const mailsManager = new MailManager();
export default mailsManager;

export class MailItem {
    id: string;
    type: string;
    count: number;
}

export class MailObject {
    from: string;
    subject: string;
    content: string;
    items: MailItem[];
}

export class MailInst {
    recievedIDs: number[];
    deletedIDs: number[];
    mailList: { [key: string]: MailObject };
}
