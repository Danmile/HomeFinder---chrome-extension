import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;
    if (!mongoURI) {
      throw new Error("MongoURI is not defined");
    }
    const conn = await mongoose.connect(mongoURI);
    console.log("MongoDB connected: ", conn.connection.host);
  } catch (error) {
    console.log("MongoDB connection error ", error);
  }
};
