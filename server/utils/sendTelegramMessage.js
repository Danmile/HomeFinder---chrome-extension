import axios from "axios";

export async function sendTelegramMessage(chatId, message) {
  const url = `https://api.telegram.org/bot${process.env.TELEGRAMTOKEN}/sendMessage`;

  try {
    const res = await axios.post(url, {
      chat_id: chatId,
      text: message,
      parse_mode: "HTML",
    });

    console.log("Message sent:", res.data);
  } catch (err) {
    console.error("Telegram send error:", err.response?.data || err.message);
  }
}
