var { guard_config: { logChannelWebHook, channel_limit }, emotes } = require("../../../config.js");
const { EmbedBuilder, Colors, AuditLogEvent, WebhookClient } = require("discord.js");
const guardModel = require("../../Models/guardSchema");
const guildModel = require("../../Models/guildSchema");
const userModel = require("../../Models/userSchema");
const config = require("../../../config.js")
const bot = global.guard;
const recentlyRestored = new Set();
const restoringByKey = new Set();

module.exports = async (channel) => {
  const guild = channel.guild;
  const entry = await guild
    .fetchAuditLogs({ type: AuditLogEvent.ChannelDelete, limit: 1 })
    .then((x) => x.entries.first())
    .catch(() => { });

  if (!entry || entry.createdTimestamp <= Date.now() - 10000) return;
  if (await bot.checkUser(["CHANNEL_DELETE"], guild, entry.executor.id)) return;
  // Debounce to avoid double-restore if the event fires twice quickly
  if (recentlyRestored.has(channel.id)) return;
  recentlyRestored.add(channel.id);
  setTimeout(() => recentlyRestored.delete(channel.id), 5000);

  // Prevent concurrent duplicate restores using a composite key
  const restoreKey = `${guild.id}:${channel.name}:${channel.parentId || 'root'}`;
  if (restoringByKey.has(restoreKey)) return;
  restoringByKey.add(restoreKey);
  setTimeout(() => restoringByKey.delete(restoreKey), 10000);

  // If a channel with the same name and parent already exists, do not clone again (fetch fresh list)
  const channels = await guild.channels.fetch().catch(() => guild.channels.cache);
  const existsSame = Array.from(channels.values ? channels.values() : channels)
    .some((c) => c && c.name === channel.name && c.parentId === channel.parentId);
  if (existsSame) return;

  // Safety: If our bot already created a channel with same name/parent very recently, skip
  try {
    const createdLogs = await guild.fetchAuditLogs({ type: AuditLogEvent.ChannelCreate, limit: 5 });
    const recentBotCreate = createdLogs.entries.find((e) =>
      e.executor && e.executor.id === bot.user.id &&
      e.target && e.target.name === channel.name &&
      e.createdTimestamp > Date.now() - 10000 // last 10s
    );
    if (recentBotCreate) return;
  } catch (_) { }

  channel
    .clone({ name: channel.name, reason: "PX-Guard: Kanal silme geri yükleme" })
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
