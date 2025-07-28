const { guard_config: { logChannelWebHook, server_limit }, emotes } = require("../../../config.js");
const { EmbedBuilder, Colors, AuditLogEvent, WebhookClient } = require("discord.js");
const guildModel = require("../../Models/guildSchema");
const userModel = require("../../Models/userSchema");
const bot = global.guard;

module.exports = async (oldGuild, newGuild) => {
  let guild = oldGuild;
  let entry = await oldGuild.fetchAuditLogs({ type: 1, limit: 1 }).then(logs => logs.entries.first());

  if (!entry || entry.createdTimestamp <= Date.now() - 10000) return;
  if (await bot.checkUser(["SERVER_PROTECT"], guild, entry.executor.id)) return;

  await oldGuild
    .edit({ name: oldGuild.name, verificationLevel: oldGuild.verificationLevel, explicitContentFilter: oldGuild.explicitContentFilter, afkChannel: oldGuild.afkChannel, systemChannel: oldGuild.systemChannel, afkTimeout: oldGuild.afkTimeout, splash: oldGuild.splash, discoverySplash: oldGuild.discoverySplash, banner: oldGuild.banner, systemChannelFlags: oldGuild.systemChannelFlags, rulesChannel: oldGuild.rulesChannel, publicUpdatesChannel: oldGuild.publicUpdatesChannel, preferredLocale: oldGuild.preferredLocale, description: oldGuild.description, features: oldGuild.features, defaultMessageNotifications: oldGuild.defaultMessageNotifications })
    .then(() => oldGuild.iconURL() !== newGuild.iconURL() ? oldGuild.setIcon(oldGuild.iconURL({ dynamic: true })) : "")
    .catch(() => { })

  let log = new WebhookClient({ url: logChannelWebHook });
  await userModel
    .updateOne({ guildID: guild.id, userID: entry.executor.id }, { $inc: { "guildGuard.guildUpdate": 1 } }, { upsert: true })

  let userFind = await userModel.findOne({ guildID: guild.id, userID: entry.executor.id })
  let userData = userFind ? userFind.guildGuard || "" : ""

  if (log) {
    const embed = new EmbedBuilder()
      .setTitle(`${emotes.safe} Sunucu Koruma`)
      .setDescription(`> ${entry.executor} yetkilisi **<t:${Math.floor(Date.now() / 1000)}:f>** tarihinde **sunucuyu düzenledi** ve gerekli işlemler uygulandı.`)
      .addFields([
        { name: "Yetkili ↷", value: "```" + `${entry.executor.tag} | ${entry.executor.id}` + "```", inline: true },
        { name: "Yetkili Limiti ↷", value: "```" + String(`${server_limit}/${userData?.guildUpdate}`) + "```", inline: true }
      ])
      .setThumbnail(guild.iconURL({ dynamic: true }))
      .setFooter({ text: entry.executor.tag, iconURL: entry.executor.avatarURL({ dynamic: true }) })
      .setColor(Colors.Blurple)

    log
      ?.send({ embeds: [embed] })
      .catch(() => { })
  }

  if (Number(userData?.guildUpdate || 0) >= Number(server_limit)) {
    if (log) {
      const embed = new EmbedBuilder()
        .setTitle(`${emotes.uyarı} Dikkat!`)
        .setDescription(`> ${entry.executor} yetkilisi **<t:${Math.floor(Date.now() / 1000)}:f>** tarihinde **sunucu koruma** limitine ulaştı ve cezalandırıldı.`)
        .addFields([
          { name: "Yetkili ↷", value: "```" + `${entry.executor.tag} | ${entry.executor.id}` + "```" },
        ])
        .setThumbnail(guild.iconURL({ dynamic: true }))
        .setFooter({ text: entry.executor.tag, iconURL: entry.executor.avatarURL({ dynamic: true }) })
        .setColor(Colors.Red)

      log
        ?.send({ embeds: [embed] })
        .catch(() => { })
    }

    bot
      .ban(guild.members.cache.get(entry.executor.id), guild.id)

    await userModel
      .updateOne({ guildID: guild.id, userID: entry.executor.id }, { $set: { "guildGuard.guildUpdate": 0 } }, { upsert: true })
      .then(async () => await guildModel
        .updateOne({ guildID: guild.id }, { $push: { infos: { type: "Sunucu Düzenleme", userID: entry.executor.id, time: Date.now(), jail: true } } }, { upsert: true }))
  } else {
    await guildModel
      .updateOne({ guildID: guild.id }, { $push: { infos: { type: "Sunucu Düzenleme", userID: entry.executor.id, time: Date.now(), jail: false } } }, { upsert: true })
  }
};
module.exports.conf = {
  name: "guildUpdate",
};