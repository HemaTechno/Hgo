// notify.js
import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";

const app = express();
app.use(bodyParser.json());

const BOT_TOKEN = "8336985451:AAGV4-7sN0TBiLT4tfoDs9Z-2Y1qrGkQpHQ"; // ضع هنا توكن بوت تيليجرام

app.post("/notify", async (req, res) => {
  const { telegramId, message } = req.body;
  if (!telegramId || !message) return res.sendStatus(400);

  try {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: telegramId,
        text: message,
        parse_mode: "HTML"
      })
    });
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

app.listen(3000, () => console.log("Notifier running on port 3000"));
