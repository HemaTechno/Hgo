import { Telegraf, Markup } from "telegraf";
import firebase from "firebase/compat/app";
import "firebase/compat/database";

// 🔹 إعدادات Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBoPJbx5v6EkOqxOJkbhzHqIJdAByh79Rg",
  authDomain: "hhhhhh-d4fb8.firebaseapp.com",
  databaseURL: "https://hhhhhh-d4fb8-default-rtdb.firebaseio.com",
  projectId: "hhhhhh-d4fb8",
  storageBucket: "hhhhhh-d4fb8.appspot.com",
  messagingSenderId: "24512338206",
  appId: "1:24512338206:web:dfe045db59bd3434a2110f",
  measurementId: "G-HD4R7GNQ5H",
};

if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// 🔹 إعداد البوت
const bot = new Telegraf(process.env.BOT_TOKEN);

// 🔸 أمر /start
bot.start(async (ctx) => {
  const telegramId = ctx.from.id;
  const name = ctx.from.first_name || "مستخدم";

  try {
    const ref = db.ref(`users/${telegramId}`);
    const snap = await ref.once("value");

    if (!snap.exists()) {
      await ref.set({
        id: telegramId,
        name,
        status: "معلق",
        createdAt: Date.now(),
      });
      return ctx.reply(`👋 أهلاً ${name}!\nتم تسجيلك بنجاح ✅\nيرجى انتظار المراجعة.`);
    }

    const user = snap.val();

    if (user.status === "مقبول") {
      return ctx.reply(`🎉 أهلاً ${name}!\nإليك الأوامر المتاحة:`, {
        reply_markup: {
          inline_keyboard: [
            [{ text: "📜 عرض الطلبات", callback_data: "orders" }],
            [{ text: "🆕 إنشاء طلب جديد", callback_data: "new_order" }],
          ],
        },
      });
    } else if (user.status === "معلق") {
      return ctx.reply("⏳ حسابك ما زال قيد المراجعة. يرجى الانتظار 💬");
    } else if (user.status === "مرفوض") {
      return ctx.reply("❌ تم رفض حسابك. يرجى التحقق من الإثبات.", {
        reply_markup: {
          inline_keyboard: [
            [{ text: "📱 الدخول للتطبيق", web_app: { url: "https://hematech.xyz/miniapp" } }],
          ],
        },
      });
    }
  } catch (err) {
    console.error("Firebase error:", err);
    ctx.reply("⚠️ حدث خطأ أثناء التحقق من حالتك.");
  }
});

bot.action("orders", (ctx) => ctx.reply("📦 هذه الطلبات الخاصة بك."));
bot.action("new_order", (ctx) => ctx.reply("📝 أرسل تفاصيل الطلب الجديد."));

// 🔹 تصدير Webhook handler لـ Vercel
export const config = { api: { bodyParser: false } };
export default async function handler(req, res) {
  if (req.method === "POST") {
    await bot.handleUpdate(req.body, res);
    res.status(200).end();
  } else {
    res.status(200).send("🤖 Bot is running via Webhook!");
  }
}
