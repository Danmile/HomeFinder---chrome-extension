import { fetchAds, generateMessage } from "./scripts.js";
import { sendTelegramMessage } from "./utils/sendTelegramMessage.js";
import { searchList } from "./store/store.js";

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
