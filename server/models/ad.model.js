import mongoose from "mongoose";

const adSchema = new mongoose.Schema({
  key: String,
  orderId: Number,
  address: Object,
  price: Number,
  additionalDetails: Object,
  token: String,
  createdAt: { type: Date, default: Date.now },
});

export const Ad = mongoose.model("Ad", adSchema);
