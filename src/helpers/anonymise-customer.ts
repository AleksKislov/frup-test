import { ICustomer } from "../tools/models";
import { genRndDetermStr } from "./gen-rnd-determ-str";

export function getAnonCustomer(cus: ICustomer): ICustomer {
  cus.firstName = genRndDetermStr(cus.firstName);
  cus.lastName = genRndDetermStr(cus.lastName);
  cus.email = genRndDetermStr(cus.email.split("@")[0]) + "@" + cus.email.split("@")[1];
  cus.address.line1 = genRndDetermStr(cus.address.line1);
  cus.address.line2 = genRndDetermStr(cus.address.line2);
  cus.address.postcode = genRndDetermStr(cus.address.postcode);
  return cus;
}
