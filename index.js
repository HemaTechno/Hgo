const express = require("express");
const fetch = require("node-fetch");
const app = express();

app.use(express.urlencoded({ extended: true })); // Monetag يبعت data كـ form-data
app.use(express.json());

const DISCORD_WEBHOOK = "https://discord.com/api/webhooks/1393547178303291522/hmtx4v0wswgmgY6IPf2k4u_zegy9aWvhCdKpu6HAzMZ77wYbHemIW2SjoKLjdaX8mxDd";

app.post("/postback", async (req, res) => {
  const data = req.body;

  // بيانات Monetag (Macros)
  const telegramId = data.telegram_id || "unknown";
  const zoneId = data.zone_id || "n/a";
  const eventType = data.event_type || "n/a";
  const reward = data.reward_event_type || "no";
  const price = data.estimated_price || "0";

  // إرسال إلى Discord
  await fetch(DISCORD_WEBHOOK, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      embeds: [
        {
          title: "📡 Monetag Postback Event",
          color: 3447003,
          fields: [
            { name: "👤 Telegram ID", value: telegramId, inline: true },
            { name: "🌍 Zone ID", value: zoneId, inline: true },
            { name: "🎬 Event Type", value: eventType, inline: true },
            { name: "🎁 Reward", value: reward, inline: true },
            { name: "💰 Price", value: price, inline: true }
          ],
          timestamp: new Date()
        }
      ]
    })
  });

  res.send("ok");
});

// شغل السيرفر
app.listen(3000, () => console.log("Server running on port 3000"));
