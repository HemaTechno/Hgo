// ✅ api/notify.js

// لا تحتاج إلى "node-fetch" في Vercel لأن fetch مدمج تلقائيًا في بيئة التشغيل الحديثة
const BOT_TOKEN = process.env.BOT_TOKEN; // ضع التوكن في إعدادات Vercel → Environment Variables

export default async function handler(req, res) {
  // السماح فقط بـ POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { telegramId, message } = req.body;

    // التحقق من البيانات
    if (!telegramId || !message) {
      return res
        .status(400)
        .json({ error: "Missing telegramId or message" });
    }

    // إرسال الرسالة إلى تيليجرام
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

    return res.status(200).json({ success: true, result: data });
  } catch (err) {
    console.error("Notify error:", err);
    return res.status(500).json({ error: err.message });
  }
}

