import * as dotenv from "dotenv";
import { type Channel } from "amqplib";
import mongoose, { ConnectOptions } from "mongoose";
import { Customer } from "./tools/models";
import { CONNECT_OPTS, INTERVAL, EXCHANGE, ROUT_KEY } from "./tools/consts";
import { createPubChannel } from "./tools/channel";
import { createRndCustomers } from "./helpers/create-customers";
import { endWithErr } from "./helpers/end-with-err";
dotenv.config();

let channel: Channel;

(async () => {
  try {
    await mongoose.connect(process.env.DB_URI as string, CONNECT_OPTS as ConnectOptions);
    channel = await createPubChannel();
    setInterval(insertAndPublish, INTERVAL);
  } catch (e) {
    endWithErr(e);
  }
})();

async function insertAndPublish() {
  const newCustomers = await Customer.insertMany(createRndCustomers()).catch(console.log);
  if (!newCustomers) return;

  channel.publish(EXCHANGE, ROUT_KEY, Buffer.from(JSON.stringify(newCustomers)), {
    persistent: true,
  });

  // console.log(`Inserted ${newCustomers.length} customers`);
}
