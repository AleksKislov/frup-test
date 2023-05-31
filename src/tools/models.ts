import mongoose, { Schema, Document } from "mongoose";

export interface ICustomer extends Document {
  firstName: string;
  lastName: string;
  email: string;
  address: {
    line1: string;
    line2: string;
    postcode: string;
    city: string;
    state: string;
    country: string;
  };
  createdAt: Date;
}

const commonSchema = {
  firstName: String,
  lastName: String,
  email: String,
  address: {
    line1: String,
    line2: String,
    postcode: String,
    city: String,
    state: String,
    country: String,
  },
  createdAt: { type: Date, default: Date.now },
};

export const Customer = mongoose.model<ICustomer>("Customer", new Schema(commonSchema));

export const AnonCustomer = mongoose.model<ICustomer>(
  "CustomerAnonymised",
  new Schema(commonSchema, { collection: "customers_anonymised" })
);
