import mongoose from "mongoose";

const searchListSchema = new mongoose.Schema({
  address: {
    type: String,
  },
  price: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const searchList = mongoose.model("searchList", searchListSchema);
