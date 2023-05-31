import { ICustomer } from "../tools/models";
import { BATCH_SIZE, TIME_TO_WAIT } from "../tools/consts";

export class Store {
  customersToInsert: ICustomer[];
  lastTimestamp: number;

  constructor() {
    this.customersToInsert = [];
    this.lastTimestamp = Date.now();
  }

  reset() {
    this.customersToInsert = [];
    this.lastTimestamp = Date.now();
  }

  add(customer: ICustomer) {
    this.customersToInsert.push(customer);
  }

  get isOkToInsert() {
    return this.customersToInsert.length >= BATCH_SIZE || this._timeIsUp();
  }

  _timeIsUp() {
    const currentTimestamp = Date.now();
    const elapsedMilliseconds = currentTimestamp - this.lastTimestamp;
    return elapsedMilliseconds >= TIME_TO_WAIT;
  }
}
