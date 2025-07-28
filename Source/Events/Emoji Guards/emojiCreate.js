const { guard_config: { logChannelWebHook, emote_limit }, emotes } = require("../../../config.js");
const { EmbedBuilder, Colors, AuditLogEvent, WebhookClient } = require("discord.js");
const guildModel = require("../../Models/guildSchema");
const userModel = require("../../Models/userSchema");
const bot = global.guard;

module.exports = async (emoji) => {
  const guild = emoji.guild;
  const entry = await guild
    .fetchAuditLogs({ type: 60, limit: 1 })
    .then((x) => x.entries.first());

  if (!entry || entry.createdTimestamp <= Date.now() - 10000) return;
  if (await bot.checkUser(["EMOTE_GUARD"], guild, entry.executor.id)) return;

  emoji
    .delete()
    .catch(() => { })

  let log = new WebhookClient({ url: logChannelWebHook });
  await userModel
    .updateOne({ guildID: guild.id, userID: entry.executor.id }, { $inc: { "emoteGuard.emoteCreate": 1 } }, { upsert: true })

  let userFind = await userModel.findOne({ guildID: guild.id, userID: entry.executor.id })
  let userData = userFind ? userFind.emoteGuard || "" : ""

  if (log) {
    const embed = new EmbedBuilder()
      .setTitle(`${emotes.safe} Emoji Koruma`)
      .setDescription(`> ${entry.executor} yetkilisi **<t:${Math.floor(Date.now() / 1000)}:f>** tarihinde **emoji oluşturdu** ve gerekli işlemler uygulandı.`)
      .addFields([
        { name: "Yetkili ↷", value: "```" + `${entry.executor.tag} | ${entry.executor.id}` + "```" },
        { name: "Emoji ↷", value: "```" + `${emoji.name} | ${emoji.id}` + "```" },
        { name: "Emoji URL ↷", value: "```" + emoji.imageURL() + "```" },
        { name: "Yetkili Limiti ↷", value: "```" + String(`${emote_limit.create}/${userData?.emoteCreate}`) + "```", inline: true },
      ])
      .setThumbnail(guild.iconURL({ dynamic: true }))
      .setFooter({ text: entry.executor.tag, iconURL: entry.executor.avatarURL({ dynamic: true }) })
      .setColor(Colors.Blurple)

    log
      ?.send({ embeds: [embed] })
      .catch(() => { })
  }

  if (Number(userData?.emoteCreate || 0) >= Number(emote_limit.create)) {
    if (log) {
      const embed = new EmbedBuilder()
        .setTitle(`${emotes.uyarı} Dikkat!`)
        .setDescription(`> ${entry.executor} yetkilisi **<t:${Math.floor(Date.now() / 1000)}:f>** tarihinde **emoji koruma** limitine ulaştı ve cezalandırıldı.`)
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
      .updateOne({ guildID: guild.id, userID: entry.executor.id }, { $set: { "emoteGuard.emoteCreate": 0 } }, { upsert: true })
      .then(async () => await guildModel
        .updateOne({ guildID: guild.id }, { $push: { infos: { type: "Emoji Oluşturma", userID: entry.executor.id, time: Date.now(), jail: true } } }, { upsert: true }))
  } else {
    await guildModel
      .updateOne({ guildID: guild.id }, { $push: { infos: { type: "Emoji Oluşturma", userID: entry.executor.id, time: Date.now(), jail: false } } }, { upsert: true })
  }
};
module.exports.conf = {
  name: "emojiCreate",
};
