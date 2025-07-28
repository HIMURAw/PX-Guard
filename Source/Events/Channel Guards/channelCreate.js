const { guard_config: { logChannelWebHook, channel_limit }, emotes } = require("../../../config.js");
const { EmbedBuilder, Colors, AuditLogEvent, WebhookClient } = require("discord.js");
const guildModel = require("../../Models/guildSchema");
const userModel = require("../../Models/userSchema");
const bot = global.guard;

module.exports = async (channel) => {
  const guild = channel.guild;
  const entry = await guild
    .fetchAuditLogs({ type: AuditLogEvent.ChannelCreate, limit: 1 })
    .then((x) => x.entries.first())
    .catch(() => { })

  if (!entry || entry.createdTimestamp <= Date.now() - 10000) return;
  let limit = Number(channel_limit.create * 2);
  let whitelist_check = await bot.checkUser(["CHANNEL_CREATE"], guild, entry.executor.id)
  if (whitelist_check) {
    if (whitelist_check == "bot_perm" || whitelist_check == "full_perm") {
      return;
    }

    await userModel
      .updateOne({ guildID: guild.id, userID: entry.executor.id }, { $inc: { whitelistGuardPoint: 1 } }, { upsert: true })

    return;
  }

  await channel
    .delete()
    .catch(() => { })

  let type;
  if (channel.type === 0) type = "Yazı Kanalı";
  if (channel.type === 2) type = "Ses Kanalı";
  if (channel.type === 4) type = "Kategori";

  let log = new WebhookClient({ url: logChannelWebHook });
  await userModel
    .updateOne({ guildID: guild.id, userID: entry.executor.id }, { $inc: { "channelGuard.channelCreate": 1, guardPoint: 1 } }, { upsert: true })

  let userFind = await userModel.findOne({ guildID: guild.id, userID: entry.executor.id })
  let userData = userFind ? userFind.channelGuard || "" : ""

  if (log) {
    const embed = new EmbedBuilder()
      .setTitle(`${emotes.safe} Kanal Koruma`)
      .setDescription(`> ${entry.executor} yetkilisi **<t:${Math.floor(Date.now() / 1000)}:f>** tarihinde **kanal oluşturdu** ve gerekli işlemler uygulandı.`)
      .addFields([
        { name: "Yetkili ↷", value: "```" + `${entry.executor.tag} | ${entry.executor.id}` + "```" },
        { name: "Kanal ↷", value: "```" + `${channel.name} | ${channel.id}` + "```" },
        { name: "Kanal Türü ↷", value: "```" + type + "```", inline: true },
        { name: "Yetkili Limiti ↷", value: "```" + String(`${channel_limit.create}/${userData?.channelCreate}`) + "```", inline: true },
      ])
      .setThumbnail(channel.guild.iconURL({ dynamic: true }))
      .setFooter({ text: entry.executor.tag, iconURL: entry.executor.avatarURL({ dynamic: true }) })
      .setColor(Colors.Aqua)

    log
      ?.send({ embeds: [embed] })
      .catch(() => { })
  }

  if (Number(userData?.channelCreate || 0) >= Number(channel_limit.create)) {
    if (log) {
      const embed = new EmbedBuilder()
        .setTitle(`${emotes.uyarı} Dikkat!`)
        .setDescription(`> ${entry.executor} yetkilisi **<t:${Math.floor(Date.now() / 1000)}:f>** tarihinde **kanal koruma** limitine ulaştı ve cezalandırıldı.`)
        .addFields([
          { name: "Yetkili ↷", value: "```" + `${entry.executor.tag} | ${entry.executor.id}` + "```" },
        ])
        .setThumbnail(channel.guild.iconURL({ dynamic: true }))
        .setFooter({ text: entry.executor.tag, iconURL: entry.executor.avatarURL({ dynamic: true }) })
        .setColor(Colors.Red)

      log
        ?.send({ embeds: [embed] })
        .catch(() => { })
    }

    bot
      .ban(guild.members.cache.get(entry.executor.id), guild.id)
    await userModel
      .updateOne({ guildID: guild.id, userID: entry.executor.id }, { $set: { "channelGuard.channelCreate": 0 } }, { upsert: true })
      .then(async () => await guildModel
        .updateOne({ guildID: guild.id }, { $push: { infos: { type: "Bot Ekleme", userID: entry.executor.id, time: Date.now(), jail: true } } }, { upsert: true }))
  } else {
    await guildModel
      .updateOne({ guildID: guild.id }, { $push: { infos: { type: "Bot Ekleme", userID: entry.executor.id, time: Date.now(), jail: false } } }, { upsert: true })
  }
};
module.exports.conf = {
  name: "channelCreate",
};
