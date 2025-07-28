const { guard_config: { logChannelWebHook, role_limit }, emotes } = require("../../../config.js");
const { EmbedBuilder, Colors, AuditLogEvent, WebhookClient } = require("discord.js");
const guardModel = require("../../Models/guardSchema");
const guildModel = require("../../Models/guildSchema");
const userModel = require("../../Models/userSchema");
const roleModel = require("../../Models/roleSchema");
const chillout = require("chillout");
var moment = require("moment");
const Guards = global.bots;
const bot = global.guard;

module.exports = async (role) => {
  const guild = role.guild;
  const logs = await guild
    .fetchAuditLogs({ type: 32, limit: 100 });
  const entry = logs?.entries.find((x) => x.targetId === role.id);

  if (!entry) return;
  if (await bot.checkUser(["ROLE_DELETE"], guild, entry.executor.id)) return;

  let roleMembers = 0;
  await role.guild.roles
    .create({ name: role.name, color: role.color, permissions: role.permissions, position: role.rawPosition, hoist: role.hoist, mentionable: role.mentionable, icon: role.icon, unicodeEmoji: role.unicodeEmoji })
    .then(async (newRole) => {
      await bot
        .updateConfigValueByValue(role.id, newRole.id);

      let guildFind = await guardModel.findOne({ guildID: guild.id })
      let membersData = guildFind ? guildFind.roles.map((x) => x) || [] : []
      let membersFind = membersData.find((x) => x.roleID === role.id)

      await roleModel.updateMany({ "Permissions.id": role.id }, { $set: { "Permissions.$.id": newRole.id } })
      const updatedChannels = await roleModel.find({ "Permissions.id": newRole.id })

      if (updatedChannels.length > 0) {
        const channelsCount = Math.ceil(updatedChannels.length / Guards.length);

        await chillout.repeat(Guards.length, async i => {
          let line = i + 1
          const channels = updatedChannels.slice(i * channelsCount, line * channelsCount);
          if (channels.length <= 0) return;

          const server = Guards[i].guilds.cache.get(guild.id);
          await channels.forEach(async (x) => {
            let channel = server.channels.cache.get(x.Id)
            channel
              .edit({ permissionOverwrites: x.Permissions })
              .catch(() => { });
          })
        })
      }

      if (membersFind) {
        let members = membersFind?.members.map((x) => x)
        roleMembers = members.length
        if (members.length > 0) {
          const membersCount = Math.ceil(members.length / Guards.length);
          await chillout.repeat(Guards.length, async i => {
            let line = i + 1
            const users = members.slice(i * membersCount, line * membersCount);
            if (users.length <= 0) return;

            const server = Guards[i].guilds.cache.get(guild.id);
            await users.forEach(async (x) => {
              const member = await server.members.cache.get(x);

              await member?.roles
                ?.add(newRole.id)
                .catch(() => { });
            });
          });
        }

        await guardModel
          .updateOne({ guildID: guild.id }, { $pull: { roles: { roleID: role.id } } }, { upsert: true })
          .then(async () => await guardModel
            .updateOne({ guildID: guild.id }, { $push: { roles: { roleID: newRole.id, members: members } } }, { upsert: true }))
      }
    })
    .catch(() => { })

  let log = new WebhookClient({ url: logChannelWebHook });
  await userModel
    .updateOne({ guildID: guild.id, userID: entry.executor.id }, { $inc: { "roleGuard.roleCreate": 1 } }, { upsert: true })

  let userFind = await userModel.findOne({ guildID: guild.id, userID: entry.executor.id })
  let userData = userFind ? userFind.roleGuard || "" : ""

  if (log) {
    const embed = new EmbedBuilder()
      .setTitle(`${emotes.safe} Rol Koruma`)
      .setDescription(`> ${entry.executor} yetkilisi **<t:${Math.floor(Date.now() / 1000)}:f>** tarihinde **rol sildi** ve gerekli işlemler uygulandı.`)
      .addFields([
        { name: "Yetkili ↷", value: "```" + `${entry.executor.tag} | ${entry.executor.id}` + "```" },
        { name: "Rol ↷", value: "```" + `${role.name} | ${role.id}` + "```" },
        { name: "Yetkili Limiti ↷", value: "```" + String(`${Number(role_limit.delete)}/${Number(userData?.roleCreate || 0)}`) + "```", inline: true },
        { name: "Role Sahip Üye Sayısı ↷", value: "```" + String(roleMembers) + "```", inline: true },
      ])
      .setThumbnail(guild.iconURL({ dynamic: true }))
      .setFooter({ text: entry.executor.tag, iconURL: entry.executor.avatarURL({ dynamic: true }) })
      .setColor(Colors.Blurple)

    log
      ?.send({ embeds: [embed] })
      .catch(() => { })
  }

  if (Number(userData?.roleCreate || 0) >= Number(role_limit.delete)) {
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
        .updateOne({ guildID: guild.id }, { $push: { infos: { type: "Rol Silme", userID: entry.executor.id, time: Date.now(), jail: true } } }, { upsert: true }))
  } else {
    await guildModel
      .updateOne({ guildID: guild.id }, { $push: { infos: { type: "Rol Silme", userID: entry.executor.id, time: Date.now(), jail: false } } }, { upsert: true })
  }
};
module.exports.conf = {
  name: "roleDelete",
};
