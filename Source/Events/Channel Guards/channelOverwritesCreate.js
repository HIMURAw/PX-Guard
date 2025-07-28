const { guard_config: { logChannelWebHook, channel_limit }, emotes } = require("../../../config.js");
const { EmbedBuilder, Colors, AuditLogEvent, WebhookClient } = require("discord.js");
const guildModel = require("../../Models/guildSchema");
const userModel = require("../../Models/userSchema");
const bot = global.guard;

module.exports = async (oldChannel, newChannel) => {
  const guild = oldChannel.guild;
  const entry = await guild
    .fetchAuditLogs({ type: 13, limit: 1 })
    .then((x) => x.entries
      .filter((x) => x.executor.id !== bot.user.id)
      .filter((x) => Number(x?.createdTimestamp) > Number(Date.now() - 10000))
      .filter((x) => Number(x?.target.permissionOverwrites?.cache?.size) > oldChannel?.permissionOverwrites?.cache?.size)
      .first());

  if (!entry || entry.createdTimestamp <= Date.now() - 10000) return;
  if (await bot.checkUser(["CHANNEL_UPDATE"], guild, entry.executor.id)) return;

  oldChannel.permissionOverwrites
    .delete(entry.extra.id)
    .catch(() => { })

  let type;
  if (oldChannel.type === 0) type = "Yazı Kanalı";
  if (oldChannel.type === 2) type = "Ses Kanalı";
  if (oldChannel.type === 4) type = "Kategori";

  let log = new WebhookClient({ url: logChannelWebHook });
  await userModel
    .updateOne({ guildID: guild.id, userID: entry.executor.id }, { $inc: { "channelGuard.channelUpdate": 1 } }, { upsert: true })

  let userFind = await userModel.findOne({ guildID: guild.id, userID: entry.executor.id })
  let userData = userFind ? userFind.channelGuard || "" : ""

  if (log) {
    const embed = new EmbedBuilder()
      .setTitle(`${emotes.safe} Kanal Koruma`)
      .setDescription(`> ${entry.executor} yetkilisi **<t:${Math.floor(Date.now() / 1000)}:f>** tarihinde **kanal düzenledi** ve gerekli işlemler uygulandı.`)
      .addFields([
        { name: "Yetkili ↷", value: "```" + `${entry.executor.tag} | ${entry.executor.id}` + "```" },
        { name: "Kanal ↷", value: "```" + `${oldChannel.name} | ${oldChannel.id}` + "```" },
        { name: "Kanal Türü ↷", value: "```" + type + "```", inline: true },
        { name: "Yetkili Limiti ↷", value: "```" + String(`${channel_limit.update}/${userData?.channelUpdate}`) + "```", inline: true },
      ])
      .setThumbnail(oldChannel.guild.iconURL({ dynamic: true }))
      .setFooter({ text: entry.executor.tag, iconURL: entry.executor.avatarURL({ dynamic: true }) })
      .setColor(Colors.Blurple)

    log
      ?.send({ embeds: [embed] })
      .catch(() => { })
  }

  if (Number(userData?.channelUpdate || 0) >= Number(channel_limit.update)) {
    if (log) {
      const embed = new EmbedBuilder()
        .setTitle(`${emotes.uyarı} Dikkat!`)
        .setDescription(`> ${entry.executor} yetkilisi **<t:${Math.floor(Date.now() / 1000)}:f>** tarihinde **kanal koruma** limitine ulaştı ve cezalandırıldı.`)
        .addFields([
          { name: "Yetkili ↷", value: "```" + `${entry.executor.tag} | ${entry.executor.id}` + "```" },
        ])
        .setThumbnail(oldChannel.guild.iconURL({ dynamic: true }))
        .setFooter({ text: entry.executor.tag, iconURL: entry.executor.avatarURL({ dynamic: true }) })
        .setColor(Colors.Red)

      log
        ?.send({ embeds: [embed] })
        .catch(() => { })
    }

    bot
      .ban(guild.members.cache.get(entry.executor.id), guild.id)
    await userModel
      .updateOne({ guildID: guild.id, userID: entry.executor.id }, { $set: { "channelGuard.channelUpdate": 0 } }, { upsert: true })
      .then(async () => await guildModel
        .updateOne({ guildID: guild.id }, { $push: { infos: { type: "Kanal Düzenleme", userID: entry.executor.id, time: Date.now(), jail: true } } }, { upsert: true }))
  } else {
    await guildModel
      .updateOne({ guildID: guild.id }, { $push: { infos: { type: "Kanal Düzenleme", userID: entry.executor.id, time: Date.now(), jail: false } } }, { upsert: true })
  }
};
module.exports.conf = {
  name: "channelUpdate",
};
