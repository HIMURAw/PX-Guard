const { guard_config: { logChannelWebHook, role_limit }, emotes } = require("../../../config.js");
const { EmbedBuilder, Colors, AuditLogEvent, WebhookClient, PermissionsBitField } = require("discord.js");
const guildModel = require("../../Models/guildSchema");
const userModel = require("../../Models/userSchema");
let cooldownBot = new Map();
const bot = global.guard;

module.exports = async (oldRole, newRole) => {
  const guild = newRole.guild;
  const entry = await guild
    .fetchAuditLogs({ type: 31 })
    .then((x) => x.entries
      .filter((x) => x.executor.id !== bot.user.id)
      .filter((x) => Number(x.createdTimestamp) > Number(Date.now() - 10000))
      .filter((x) => {
        if (x.changes[0].key === "name") return x.changes[0].new !== oldRole.name;
        if (x.changes[0].key === "permissions") return String(x.changes[0].new) !== String(new PermissionsBitField(oldRole.permissions).bitfield).replace("n", "");
        if (x.changes[0].key === "hoist") return x.changes[0].new !== oldRole.hoist;
        if (x.changes[0].key === "mentionable") return x.changes[0].new !== oldRole.mentionable;
      })
      .find((x) => x.target.id === newRole.id))

  if (!entry) return;
  if (await bot.checkUser(["ROLE_UPDATE"], guild, entry.executor.id)) return;

  let limit = Number(await guild
    .fetchAuditLogs({ type: 31 })
    .then((x) => x.entries
      .filter((x) => x.executor.id !== bot.user.id)
      .filter((x) => Number(x.createdTimestamp) > Number(Date.now() - 10000))
      .map((x) => x.createdTimestamp).length))

  await newRole
    .edit({ name: oldRole.name, color: oldRole.color, hoist: oldRole.hoist, permissions: oldRole.permissions, mentionable: oldRole.mentionable, icon: oldRole.icon, unicodeEmoji: oldRole.unicodeEmoji })
    .catch(() => { })

  if (cooldownBot.get(entry.executor.id)) {
    if (limit > 1) {

      return;
    }
  }

  let log = new WebhookClient({ url: logChannelWebHook });
  await userModel
    .updateOne({ guildID: guild.id, userID: entry.executor.id }, { $inc: { "roleGuard.roleCreate": 1 } }, { upsert: true })

  let userFind = await userModel.findOne({ guildID: guild.id, userID: entry.executor.id })
  let userData = userFind ? userFind.roleGuard || "" : ""

  if (log) {
    const embed = new EmbedBuilder()
      .setTitle(`${emotes.safe} Rol Koruma`)
      .setDescription(`> ${entry.executor} yetkilisi **<t:${Math.floor(Date.now() / 1000)}:f>** tarihinde **rol düzenledi** ve gerekli işlemler uygulandı.`)
      .addFields([
        { name: "Yetkili ↷", value: "```" + `${entry.executor.tag} | ${entry.executor.id}` + "```" },
        { name: "Rol ↷", value: "```" + `${oldRole.name} | ${oldRole.id}` + "```", inline: true },
        { name: "Yetkili Limiti ↷", value: "```" + String(`${Number(role_limit.update)}/${Number(userData?.roleCreate || 0)}`) + "```", inline: true },
      ])
      .setThumbnail(guild.iconURL({ dynamic: true }))
      .setFooter({ text: entry.executor.tag, iconURL: entry.executor.avatarURL({ dynamic: true }) })
      .setColor(Colors.Blurple)

    log
      ?.send({ embeds: [embed] })
      .catch(() => { })
  }

  if (Number(userData?.roleCreate || 0) >= Number(role_limit.update)) {
    if (log) {
      const embed = new EmbedBuilder()
        .setTitle(`${emotes.uyarı} Dikkat!`)
        .setDescription(`> ${entry.executor} yetkilisi **<t:${Math.floor(Date.now() / 1000)}:f>** tarihinde **rol koruma** limitine ulaştı ve cezalandırıldı.`)
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
      .updateOne({ guildID: guild.id, userID: entry.executor.id }, { $set: { "roleGuard.roleCreate": 0 } }, { upsert: true })
      .then(async () => await guildModel
        .updateOne({ guildID: guild.id }, { $push: { infos: { type: "Rol Düzenleme", userID: entry.executor.id, time: Date.now(), jail: true } } }, { upsert: true }))
  } else {
    await guildModel
      .updateOne({ guildID: guild.id }, { $push: { infos: { type: "Rol Düzenleme", userID: entry.executor.id, time: Date.now(), jail: false } } }, { upsert: true })
  }

  cooldownBot
    .set(entry.executor.id, true)

  setTimeout(() => cooldownBot
    .delete(entry.executor.id), 10000)
};
module.exports.conf = {
  name: "roleUpdate",
};
