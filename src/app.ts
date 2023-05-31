import * as dotenv from "dotenv";
import mongoose, { ConnectOptions } from "mongoose";
import { Customer } from "./tools/models";
import { CONNECT_OPTS, INTERVAL } from "./tools/consts";
import { createRndCustomers } from "./helpers/create-customers";
import { endWithErr } from "./helpers/end-process";
dotenv.config();

(async () => {
  try {
    await mongoose.connect(process.env.DB_URI as string, CONNECT_OPTS as ConnectOptions);
    setInterval(insertAndPublish, INTERVAL);
  } catch (e) {
    endWithErr(e);
  }
})();

async function insertAndPublish() {
  const newCustomers = await Customer.insertMany(createRndCustomers()).catch(console.log);
  if (!newCustomers) return;
  // console.log(`Inserted ${newCustomers.length} customers`);
}
