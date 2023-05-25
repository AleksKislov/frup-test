import { type Channel, type ConsumeMessage } from "amqplib";
import { ICustomer } from "../tools/models";
import { TIME_TO_WAIT } from "../tools/consts";

export class Store {
  customersToInsert: ICustomer[];
  channel: Channel | null;
  lastTimestamp: number;
  lastMsg: ConsumeMessage | null;
  isPaused: boolean;

  constructor() {
    this.customersToInsert = [];
    this.channel = null;
    this.lastTimestamp = Date.now();
    this.lastMsg = null;
    this.isPaused = false;
  }

  reset() {
    if (this.lastMsg) this.channel?.ack(this.lastMsg, true);
    this.customersToInsert = [];
    this.lastTimestamp = Date.now();
    this.isPaused = false;
  }

  pause() {
    this.isPaused = true;
  }

  timeIsUp() {
    const currentTimestamp = Date.now();
    const elapsedMilliseconds = currentTimestamp - this.lastTimestamp;
    return elapsedMilliseconds >= TIME_TO_WAIT;
  }
}
