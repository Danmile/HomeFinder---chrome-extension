// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import adsRoutes from "./routes/ads.js";
import { fetchAds, generateMessage } from "./scripts.js";
import { sendTelegramMessage } from "./utils/sendTelegramMessage.js";
import cron from "node-cron";
import { searchList } from "./store/store.js";
import { connectDB } from "./lib/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cors());
app.use("/api", adsRoutes);

// Run every 3 min
cron.schedule("*/3 * * * *", async () => {
  if (searchList.size > 0) {
    for (const item of searchList) {
      const [address, price] = item.split("|");
      try {
        const ads = await fetchAds(item);
        const message = generateMessage(ads);
        if (message) {
          await sendTelegramMessage(process.env.TELEGRAMBOT, message);
        }
      } catch (error) {
        console.error(`Error fetching for ${address}, ${price}:`, error);
      }
    }
  }
});

app.listen(PORT, () => {
  console.log(`Server running on localhost:${PORT}`);
  connectDB();
});
