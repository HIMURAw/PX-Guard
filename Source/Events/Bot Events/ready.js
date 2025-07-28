const { bots_config: { guard_system: { playings } } } = require("../../../config.js");
const { genel_config } = require("../../../config.js");
const { EmbedBuilder } = require("discord.js");
const { CronJob } = require("cron");
const bot = global.guard;

module.exports = async () => {
  global.bots
    ?.push(bot)

  let descriptionFetch = await bot.application.fetch()
  if (descriptionFetch.description !== genel_config.description) {
    await bot.application
      .edit({ description: genel_config.description })
      .catch(() => { })
  }

  bot
    .emit("serverBackup")

  const daily = new CronJob("00 00 00 * * *", async () => bot.dailyInfo(), null, true, "Europe/Istanbul");
  daily.start();
  setInterval(() => bot.emit("serverBackup"), 1000 * 60 * 60 * 3)

  const playing = playings[Math.floor(Math.random() * playings.length)];
  bot.user
    .setPresence({ activities: [{ name: playing, type: 4 }], status: "online" })

  setInterval(() => {
    const playing = playings[Math.floor(Math.random() * playings.length)];

    bot.user
      .setPresence({ activities: [{ name: playing, type: 4 }], status: "idle" })
  }, 30000);
};
module.exports.conf = {
  name: "ready",
};