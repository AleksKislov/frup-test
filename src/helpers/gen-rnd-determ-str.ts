import * as crypto from "crypto";

export function genRndDetermStr(str: string): string {
  const hash = crypto.createHash("md5").update(str).digest("base64");
  const randomString = hash.substring(0, 8);
  return randomString;
}
