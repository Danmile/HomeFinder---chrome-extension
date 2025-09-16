import mongoose from "mongoose";

const searchListSchema = new mongoose.Schema({
  address: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Create a compound unique index

export const searchList = mongoose.model("searchList", searchListSchema);
