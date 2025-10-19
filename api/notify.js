// api/notify.js
import fetch from "node-fetch";

const BOT_TOKEN = process.env.BOT_TOKEN; // نخليه من متغير بيئة لأمان أكثر

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { telegramId, message } = req.body;
  if (!telegramId || !message)
    return res.status(400).json({ error: "Missing telegramId or message" });

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: telegramId,
          text: message,
          parse_mode: "HTML",
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Telegram API Error:", errorText);
      return res.status(500).json({ error: "Telegram API Error", details: errorText });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Notify error:", err);
    return res.status(500).json({ error: err.message });
  }
}
