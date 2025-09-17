import { fetchAds, generateMessage } from "./scripts.js";
import { sendTelegramMessage } from "./utils/sendTelegramMessage.js";
import { searchList } from "./store/store.js";

const connectDB = async () => {
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

async function checkAds() {
  if (searchList.size > 0) {
    console.log("Checking ads at: -", new Date().toISOString());

    for (const item of searchList) {
      const [address, price] = item.split("|");
      try {
        const ads = await fetchAds(item);
        const message = generateMessage(ads);
        if (message) {
          await sendTelegramMessage(process.env.TELEGRAMBOT, message);
          console.log(`Sent message for ${address}, ${price}`);
        } else {
          console.log(`No new ads for ${address}, ${price}`);
        }
      } catch (error) {
        console.error(`Error fetching for ${address}, ${price}:`, error);
      }
    }
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  connectDB().then(() =>
    checkAds().then(() => {
      console.log("Check completed");
      process.exit(0);
    })
  );
}
