// ================== GLOBALS ==================
require("advanced-logs");

const { Client, Partials, GatewayIntentBits, Collection } = require("discord.js");
const { Logger } = require("term-logger");
const mongoose = require("mongoose");
const moment = require("moment");
const fs = require("fs");
const path = require("path");
const { joinVoiceChannel } = require("@discordjs/voice");

// ================== CONFIG ==================
const {
  bots_config: {
    guard_system: { mongoURL, playings },
  },
  discord: { token, guards_token, voiceID },
  genel_config,
  bots_logs,
} = require("./config");

// ================== TIME ==================
const moons = {
  "01": "Ocak", "02": "Şubat", "03": "Mart", "04": "Nisan",
  "05": "Mayıs", "06": "Haziran", "07": "Temmuz", "08": "Ağustos",
  "09": "Eylül", "10": "Ekim", "11": "Kasım", "12": "Aralık",
};

process.title = "Guard Bot System";
console.clear();
console.setConfig({ background: false, timestamp: false });

// ================== INTENTS ==================
const INTENTS = [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMembers,
  GatewayIntentBits.GuildBans,
  GatewayIntentBits.GuildEmojisAndStickers,
  GatewayIntentBits.GuildWebhooks,
  GatewayIntentBits.GuildInvites,
  GatewayIntentBits.GuildVoiceStates,
  GatewayIntentBits.GuildPresences,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.GuildMessageReactions,
  GatewayIntentBits.MessageContent,
];

// ================== EVENT LOADER ==================
const loadEventsRecursive = (client, dir) => {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);

    if (fs.statSync(fullPath).isDirectory()) {
      loadEventsRecursive(client, fullPath);
      return;
    }

    if (!file.endsWith(".js")) return;

    // === BOT TYPE FİLTRE ===
    if (client.botType === "GUARD") {
      if (fullPath.includes("Log Event") || fullPath.includes("Bot Events")) return;
    }

    const event = require(fullPath);
    const eventName = path.parse(file).name;

    client.on(eventName, (...args) => event(client, ...args));
  });
};




// ================== VOICE ==================
const joinVoice = (client) => {
  const channel = client.channels.cache.get(voiceID);
  if (!channel || channel.type !== 2) return;

  const current = channel.guild.members.me?.voice?.channelId;
  if (current === channel.id) return;

  joinVoiceChannel({
    channelId: channel.id,
    guildId: channel.guild.id,
    adapterCreator: channel.guild.voiceAdapterCreator,
  });
};

// ================== MAIN BOT ==================
const bot = (global.guard = new Client({
  intents: INTENTS,
  partials: [
    Partials.Message,
    Partials.Channel,
    Partials.Reaction,
    Partials.GuildMember,
  ],
  allowedMentions: { parse: ["roles", "users", "everyone"], repliedUser: true },
}));

bot.botType = "MAIN";
bot.color = "#2b2d31";
bot.slash_Cmd = new Collection();

global.Guards = [];
global.bots = [];

// ================== HANDLERS ==================
require("./Source/Handlers/command-Handler.js");
require("./Source/Handlers/function-Handler.js");

loadEventsRecursive(bot, path.join(__dirname, "Source", "Events"));

// ================== DATABASE ==================
mongoose.set("strictQuery", true);
mongoose.connect(mongoURL)
  .then(() => {
    console.success("MongoDB bağlantısı başarılı.");
    bot.login(token);
  })
  .catch(console.error);

// ================== MAIN READY ==================
bot.once("ready", () => {
  const time = moment.utc(Date.now() + 3 * 60 * 60 * 1000);
  console.success(
    `MAIN AKTİF: ${bot.user.tag}`,
    `[${time.format("D")} ${moons[time.format("MM")]} ${time.format("YYYY HH:mm:ss")}]`
  );

  bot.channelLogs = {
    channelLog: bot.channels.cache.get(bots_logs.channelLog),
    emojiLog: bot.channels.cache.get(bots_logs.emojiLog),
    banLog: bot.channels.cache.get(bots_logs.banLog),
    unbanLog: bot.channels.cache.get(bots_logs.unbanLog),
    joinLog: bot.channels.cache.get(bots_logs.joinLog),
    leaveLog: bot.channels.cache.get(bots_logs.leaveLog),
    messageLog: bot.channels.cache.get(bots_logs.messageLog),
    voiceLog: bot.channels.cache.get(bots_logs.voiceLog),
    roleLog: bot.channels.cache.get(bots_logs.roleLog),
  };



  joinVoice(bot);

  setInterval(() => {
    const playing = playings[Math.floor(Math.random() * playings.length)];
    bot.user.setPresence({
      activities: [{ name: playing, type: 4 }],
      status: "idle",
    });
  }, 30000);
});

// ================== GUARD BOTS ==================
let index = 0;

for (const gToken of guards_token) {
  const GuardBot = new Client({
    intents: INTENTS,
    partials: [Partials.Message, Partials.Channel, Partials.Reaction],
    allowedMentions: { parse: ["roles", "users", "everyone"], repliedUser: true },
  });

  GuardBot.botType = "GUARD";
  GuardBot.color = "#2b2d31";

  GuardBot.once("ready", () => {
    index++;
    global.Guards.push(GuardBot);
    global.bots.push(GuardBot);

    GuardBot.channelLogs = {
      channelLog: GuardBot.channels.cache.get(bots_logs.channelLog),
      emojiLog: GuardBot.channels.cache.get(bots_logs.emojiLog),
      banLog: GuardBot.channels.cache.get(bots_logs.banLog),
      unbanLog: GuardBot.channels.cache.get(bots_logs.unbanLog),
      joinLog: GuardBot.channels.cache.get(bots_logs.joinLog),
      leaveLog: GuardBot.channels.cache.get(bots_logs.leaveLog),
      messageLog: GuardBot.channels.cache.get(bots_logs.messageLog),
      voiceLog: GuardBot.channels.cache.get(bots_logs.voiceLog),
      roleLog: GuardBot.channels.cache.get(bots_logs.roleLog),
    };

    loadEventsRecursive(GuardBot, path.join(__dirname, "Source", "Events"));
    joinVoice(GuardBot);

    console.success(`${index}. GUARD AKTİF: ${GuardBot.user.tag}`);
  });

  GuardBot.on("voiceStateUpdate", (_, n) => {
    if (n.id === GuardBot.user.id && n.channelId !== voiceID) {
      joinVoice(GuardBot);
    }
  });

  GuardBot.login(gToken).catch(console.error);
}
