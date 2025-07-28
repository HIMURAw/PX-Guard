var { guard_config: { logChannelWebHook, channel_limit }, emotes } = require("../../../config.js");
const { EmbedBuilder, Colors, AuditLogEvent, WebhookClient } = require("discord.js");
const guardModel = require("../../Models/guardSchema");
const guildModel = require("../../Models/guildSchema");
const userModel = require("../../Models/userSchema");
const config = require("../../../config.js")
const bot = global.guard;

module.exports = async (channel) => {
  const guild = channel.guild;
  const entry = await guild
    .fetchAuditLogs({ type: 12, limit: 1 })
    .then((x) => x.entries.first());

  if (!entry || entry.createdTimestamp <= Date.now() - 10000) return;
  if (await bot.checkUser(["CHANNEL_DELETE"], guild, entry.executor.id)) return;

  channel
    .clone({ name: channel.name, permissions: channel.withPermissions, topic: channel.topic, bitrate: this.bitrate })
    .then(async (newChannel) => {
      await bot
        .updateConfigValueByValue(channel.id, newChannel.id);

      if (newChannel.type === 4) {
        let channelsData = await guardModel.findOne({ guildID: guild.id })
        let dataGet = channelsData ? channelsData.categorys?.map(x => x) || [] : []
        let data = dataGet?.find((x) => x.channelID === channel.id)

        if (data) {
          data?.channels
            ?.map((x) => {
              let channel = guild.channels.cache.get(x)

              if (channel) {
                channel
                  ?.setParent(newChannel.id)
                  .catch(() => { })
              }
            })

          await guardModel
            .updateOne({ guildID: guild.id }, { $push: { categorys: { channelID: newChannel.id, channels: data?.channels } } }, { upsert: true })
            .then(async () => await guardModel
              .updateOne({ guildID: guild.id }, { $pull: { categorys: { channelID: channel.id } } }, { upsert: true }))
        }
      }

      let type;
      if (channel.type === 0) type = "Yazı Kanalı";
      if (channel.type === 2) type = "Ses Kanalı";
      if (channel.type === 4) type = "Kategori";

      let log = new WebhookClient({ url: logChannelWebHook });
      await userModel
        .updateOne({ guildID: guild.id, userID: entry.executor.id }, { $inc: { "channelGuard.channelDelete": 1 } }, { upsert: true })

      let userFind = await userModel.findOne({ guildID: guild.id, userID: entry.executor.id })
      let userData = userFind ? userFind.channelGuard || "" : ""

      if (log) {
        const embed = new EmbedBuilder()
          .setTitle(`${emotes.safe} Kanal Koruma`)
          .setDescription(`> ${entry.executor} yetkilisi **<t:${Math.floor(Date.now() / 1000)}:f>** tarihinde **kanal sildi** ve gerekli işlemler uygulandı.`)
          .addFields([
            { name: "Yetkili ↷", value: "```" + `${entry.executor.tag} | ${entry.executor.id}` + "```" },
            { name: "Kanal ↷", value: "```" + `${channel.name} | ${channel.id}` + "```" },
            { name: "Kanal Türü ↷", value: "```" + type + "```", inline: true },
            { name: "Yetkili Limiti ↷", value: "```" + String(`${channel_limit.delete}/${userData?.channelDelete}`) + "```", inline: true },
          ])
          .setThumbnail(channel.guild.iconURL({ dynamic: true }))
          .setFooter({ text: entry.executor.tag, iconURL: entry.executor.avatarURL({ dynamic: true }) })
          .setColor(Colors.Blurple)

        log
          ?.send({ embeds: [embed] })
          .catch(() => { })
      }

      if (Number(userData?.channelDelete || 0) >= Number(channel_limit.delete)) {
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
          .updateOne({ guildID: guild.id, userID: entry.executor.id }, { $set: { "channelGuard.channelDelete": 0 } }, { upsert: true })
          .then(async () => await guildModel
            .updateOne({ guildID: guild.id }, { $push: { infos: { type: "Kanal Silme", userID: entry.executor.id, time: Date.now(), jail: true } } }, { upsert: true }))
      } else {
        await guildModel
          .updateOne({ guildID: guild.id }, { $push: { infos: { type: "Kanal Silme", userID: entry.executor.id, time: Date.now(), jail: false } } }, { upsert: true })
      }
    })
};
module.exports.conf = {
  name: "channelDelete",
};
