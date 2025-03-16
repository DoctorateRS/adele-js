import * as fs from "std/fs";
import * as crypto from "std/crypto";

export class StandardLib {
    fs = fs;
    crypto = crypto;
}

export default new StandardLib();
