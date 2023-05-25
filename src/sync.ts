import * as dotenv from "dotenv";
import { type ConsumeMessage } from "amqplib";
import { AnonCustomer, Customer } from "./tools//models";
import mongoose, { ConnectOptions } from "mongoose";
import { CONNECT_OPTS, QUEUE } from "./tools/consts";
import { createSubChannel } from "./tools/channel";
import { getAnonCustomer } from "./helpers/anonymise-customer";
import { endWithErr } from "./helpers/end-with-err";
import { Store } from "./helpers/store";
dotenv.config();

const BATCH_SIZE = 1000; // number of documents to insert in one batch
const IsFullReindex = process.argv[2] === "--full-reindex";
const store = new Store();

(async () => {
  try {
    await mongoose.connect(process.env.DB_URI as string, CONNECT_OPTS as ConnectOptions);

    if (IsFullReindex) {
      const cursor = Customer.find({})
        .lean()
        .cursor()
        .on("data", async (customer) => {
          store.customersToInsert.push(customer);
          if (store.customersToInsert.length < BATCH_SIZE) return;

          cursor.pause();
          await anonCustomerBulkWrite();
          store.reset();
          cursor.resume();
        })
        .on("error", endWithErr)
        .on("end", async () => {
          if (store.customersToInsert.length) {
            await anonCustomerBulkWrite();
          }
          console.log("end");
          process.exit(0);
        });
    } else {
      store.channel = await createSubChannel();
      store.channel.consume(QUEUE, collectCustomers, { noAck: false });
      setInterval(insertAndReset, 500);
    }
  } catch (e) {
    endWithErr(e);
  }
})();

function getUpdates() {
  return store.customersToInsert.map(getAnonCustomer).map((customer) => {
    return {
      updateOne: {
        filter: { _id: customer._id },
        update: { $set: customer },
        upsert: true,
      },
    };
  });
}

async function collectCustomers(msg: ConsumeMessage | null) {
  if (!msg || store.isPaused) return;
  const receivedData = JSON.parse(msg.content.toString() || "[]");
  console.log("Received data", receivedData.length);
  store.customersToInsert = [...store.customersToInsert, ...receivedData];
  store.lastMsg = msg;
}

async function insertAndReset() {
  if (!store.customersToInsert.length) return;
  if (!(store.customersToInsert.length >= BATCH_SIZE || store.timeIsUp())) return;

  store.pause();
  await anonCustomerBulkWrite();
  store.reset();
}

function anonCustomerBulkWrite() {
  return AnonCustomer.bulkWrite(getUpdates(), { ordered: false });
}
