import * as dotenv from "dotenv";
const { Timestamp } = require("mongodb");
import { AnonCustomer, Customer } from "./tools//models";
import mongoose, { ConnectOptions } from "mongoose";
import { CONNECT_OPTS, BATCH_SIZE } from "./tools/consts";
import { getAnonCustomer } from "./helpers/anonymise-customer";
import { Store } from "./helpers/store";
import { timeoutPromise } from "./helpers/timeout-promise";
import { endWithMsg, endWithErr } from "./helpers/end-process";
dotenv.config();

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
          store.add(customer);
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
          endWithMsg("end full-reindex");
        });
    } else {
      const startAtOperationTime = await getStartAtOperationTime();
      if (!startAtOperationTime) return endWithErr("No data to sync");

      const stream = await Customer.watch([], { startAtOperationTime });
      let customer = null;

      while ((customer = await Promise.race([stream.next(), timeoutPromise]))) {
        store.add(customer.fullDocument);
        if (!store.isOkToInsert) continue;

        await anonCustomerBulkWrite();
        store.reset();
      }

      await anonCustomerBulkWrite();
      await stream.close();
      endWithMsg("end");
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

function anonCustomerBulkWrite() {
  return AnonCustomer.bulkWrite(getUpdates(), { ordered: false });
}

async function getStartAtOperationTime() {
  let lastCustomer = await AnonCustomer.findOne().sort({ $natural: -1 });
  if (!lastCustomer) lastCustomer = await Customer.findOne().sort({ $natural: 1 });

  if (!lastCustomer) return;
  return new Timestamp({
    t: new Date(lastCustomer.createdAt).getTime() / 1000,
    i: 1,
  });
}
