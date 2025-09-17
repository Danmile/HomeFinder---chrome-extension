// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import adsRoutes from "./routes/ads.js";
import { connectDB } from "./lib/db.js";
import { searchList } from "./models/searchList.model.js";
import { fetchAds, generateMessage } from "./scripts.js";
import { sendTelegramMessage } from "./utils/sendTelegramMessage.js";
import cron from "node-cron";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());
app.use("/api", adsRoutes);

// Run every 3 min
// cron.schedule("*/3 * * * *", async () => {
//   const searches = await searchList.find({});

//   for (const s of searches) {
//     const { addressId, address, price } = s;
//     const key = `${address}|${price}`;

//     try {
//       const ads = await fetchAds(addressId, price, key);
//       const message = generateMessage(ads);
//       if (message) {
//         await sendTelegramMessage(process.env.TELEGRAMBOT, message);
//         console.log(`Sent message for ${address}, ${price}`);
//       } else {
//         console.log(`No new ads for ${address}, ${price}`);
//       }
//     } catch (error) {
//       console.error(`Error fetching for ${address}, ${price}:`, error);
//     }
//   }
// });

app.listen(PORT, () => {
  console.log(`Server running on localhost:${PORT}`);
  connectDB();
});
