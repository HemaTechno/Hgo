import fetch from "node-fetch";

const BOT_TOKEN = process.env.BOT_TOKEN;

export default async function handler(req, res) {
  // ✅ لو GET فقط فحص حالة السيرفر
  if (req.method === "GET") {
    return res.status(200).json({ status: "ok", message: "Webhook is alive ✅" });
  }

  // ✅ لو POST يرسل رسالة تيليجرام
  if (req.method === "POST") {
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
        return res
          .status(500)
          .json({ error: "Telegram API Error", details: errorText });
      }

      return res.status(200).json({ success: true });
    } catch (err) {
      console.error("Notify error:", err);
      return res.status(500).json({ error: err.message });
    }
  }

  // ❌ لو طريقة تانية
  return res.status(405).json({ error: "Method not allowed" });
}



