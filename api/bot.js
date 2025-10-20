import { Telegraf } from "telegraf";
import firebase from "firebase/compat/app";
import "firebase/compat/database";

// 🔹 إعداد Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBoPJbx5v6EkOqxOJkbhzHqIJdAByh79Rg",
  authDomain: "hhhhhh-d4fb8.firebaseapp.com",
  databaseURL: "https://hhhhhh-d4fb8-default-rtdb.firebaseio.com",
  projectId: "hhhhhh-d4fb8",
  storageBucket: "hhhhhh-d4fb8.appspot.com",
  messagingSenderId: "24512338206",
  appId: "1:24512338206:web:dfe045db59bd3434a2110f",
  measurementId: "G-HD4R7GNQ5H"
};

// ✅ تأكد إن الفايربيس مبدأش مرتين
if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// 🧠 توكن البوت من إعدادات Vercel
const BOT_TOKEN = process.env.BOT_TOKEN;
if (!BOT_TOKEN) throw new Error("BOT_TOKEN is missing!");

// 🤖 إنشاء البوت
const bot = new Telegraf(BOT_TOKEN);

// 📌 أمر /start
bot.start(async (ctx) => {
  const id = ctx.from.id;
  const name = ctx.from.first_name || "مستخدم";
  const ref = db.ref("users/" + id);

  const snapshot = await ref.once("value");
  const user = snapshot.val();

  if (!user) {
    await ref.set({ id, name, status: "معلق", createdAt: Date.now() });
    return ctx.reply(`👋 أهلاً ${name}\nتم تسجيلك بنجاح ✅\nيرجى انتظار المراجعة.`);
  }

  if (user.status === "مقبول") {
    return ctx.reply(`🎉 أهلاً ${name}!\nإليك الأوامر المتاحة:`, {
      reply_markup: {
        inline_keyboard: [
          [{ text: "📜 عرض الطلبات", callback_data: "orders" }],
          [{ text: "🆕 إنشاء طلب جديد", callback_data: "new_order" }]
        ]
      }
    });
  } else if (user.status === "معلق") {
    return ctx.reply("⏳ حسابك قيد المراجعة حالياً، انتظر قليلاً.");
  } else if (user.status === "مرفوض") {
    return ctx.reply("❌ تم رفض حسابك. يرجى التحقق من إثبات الاشتراك.", {
      reply_markup: {
        inline_keyboard: [
          [{ text: "📱 فتح Mini App", web_app: { url: "https://hematech.xyz/miniapp" } }]
        ]
      }
    });
  }
});

// 🔧 أفعال الأزرار
bot.action("orders", (ctx) => ctx.reply("📦 لا توجد طلبات حالياً."));
bot.action("new_order", (ctx) => ctx.reply("📝 أرسل تفاصيل الطلب الجديد."));

// ⚙️ إعداد الـ Webhook لـ Vercel
export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      await bot.handleUpdate(req.body, res);
      res.status(200).end();
    } catch (err) {
      console.error("Webhook error:", err);
      res.status(500).send("Error handling update");
    }
  } else {
    res.status(200).send("🤖 Bot is running via Webhook");
  }
}

