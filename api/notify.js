// api/notify.js
import fetch from "node-fetch";

export default async function handler(req, res) {
  // السماح بالوصول من أي دومين (CORS)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // التعامل مع طلب OPTIONS الخاص بالـ preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const BOT_TOKEN = process.env.BOT_TOKEN; // ضع التوكن في إعدادات Vercel
  const { telegramId, message } = req.body;

  if (!telegramId || !message) {
    return res.status(400).json({ error: "Missing telegramId or message" });
  }

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

    const data = await response.json();

    if (!response.ok) {
      console.error("Telegram API Error:", data);
      return res
        .status(500)
        .json({ error: "Telegram API Error", details: data });
    }

    return res.status(200).json({ success: true, telegramResponse: data });
  } catch (err) {
    console.error("Notify error:", err);
    return res.status(500).json({ error: err.message });
  }
}


