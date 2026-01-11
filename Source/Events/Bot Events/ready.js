const { ActivityType } = require("discord.js");
const { CronJob } = require("cron");

const {
  bots_config: {
    guard_system: { playings },
  },
  genel_config,
  bots_logs,
} = require("../../../config");

module.exports = async (client) => {
  const bot = client; // main guard bot

  // ================== GLOBAL PUSH ==================
  global.bots?.push(bot);

  // ================== CLIENT SETUP ==================
  client.color = "#2b2d31";

  client.channelLogs = {
    channelLog: client.channels.cache.get(bots_logs.channelLog),
    emojiLog: client.channels.cache.get(bots_logs.emojiLog),
    banLog: client.channels.cache.get(bots_logs.banLog),
    unbanLog: client.channels.cache.get(bots_logs.unbanLog),
    joinLog: client.channels.cache.get(bots_logs.joinLog),
    leaveLog: client.channels.cache.get(bots_logs.leaveLog),
    messageLog: client.channels.cache.get(bots_logs.messageLog),
    voiceLog: client.channels.cache.get(bots_logs.voiceLog),
  };

  // ================== APPLICATION DESCRIPTION ==================
  try {
    const app = await bot.application.fetch();
    if (app.description !== genel_config.description) {
      await bot.application.edit({
        description: genel_config.description,
      });
    }
  } catch (err) {
    console.error("Application description güncellenemedi.");
  }

  // ================== BACKUP EVENTS ==================
  bot.emit("serverBackup");

  const daily = new CronJob(
    "00 00 00 * * *",
    async () => bot.dailyInfo?.(),
    null,
    true,
    "Europe/Istanbul"
  );
  daily.start();

  setInterval(() => bot.emit("serverBackup"), 1000 * 60 * 60 * 3);

  // ================== PRESENCE ==================
  const setPlaying = (status = "online") => {
    const playing = playings[Math.floor(Math.random() * playings.length)];
    bot.user.setPresence({
      activities: [{ name: playing, type: ActivityType.Custom }],
      status,
    });
  };

  setPlaying("online");

  setInterval(() => {
    setPlaying("idle");
  }, 30000);

  // ================== LOG PRESENCE ==================
  setInterval(() => {
    bot.user.setPresence({
      activities: [
        {
          name: "Logs | Made by @HIMURAw",
          type: ActivityType.Watching,
        },
      ],
      status: "online",
    });
  }, 60000);

  // ================== READY LOG ==================
  client.log?.ready(`Logged in as ${bot.user.tag}`);
};

module.exports.conf = {
  name: "ready",
};
