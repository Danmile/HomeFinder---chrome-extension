import mongoose from "mongoose";

const searchListSchema = new mongoose.Schema({
  address: { type: String, required: true, unique: true },
  addressId: { type: Number, required: true },
  price: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const searchList = mongoose.model("searchList", searchListSchema);
