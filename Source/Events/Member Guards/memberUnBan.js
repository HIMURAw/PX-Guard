const { guard_config: { logChannelWebHook, unban_limit }, emotes } = require("../../../config.js");
const { EmbedBuilder, Colors, AuditLogEvent, WebhookClient } = require("discord.js");
const guardModel = require("../../Models/guardSchema");
const guildModel = require("../../Models/guildSchema");
const userModel = require("../../Models/userSchema");
const bot = global.guard;

module.exports = async (member) => {
    let guild = member.guild
    let entry = await member.guild
        .fetchAuditLogs({ type: 23, limit: 1 })
        .then(logs => logs.entries.first());

    if (!entry || entry.createdTimestamp <= Date.now() - 10000) return;
    if (await bot.checkUser(["MEMBER_BAN"], guild, entry.executor.id)) return;

    let guildFind = await guardModel.findOne({ guildID: member.guild.id })
    let guildData = guildFind ? guildFind?.bans || [] : []
    let data = guildData.find((x) => x.userID == member.user.id)

    await member.guild.members
        .ban(member.user.id, { reason: String(data?.reason ? data.reason : "") })
        .catch(() => { })

    let log = new WebhookClient({ url: logChannelWebHook });
    await userModel
        .updateOne({ guildID: guild.id, userID: entry.executor.id }, { $inc: { "memberGuard.memberUnBan": 1 } }, { upsert: true })

    let userFind = await userModel.findOne({ guildID: guild.id, userID: entry.executor.id })
    let userData = userFind ? userFind.memberGuard || "" : ""

    if (log) {
        const embed = new EmbedBuilder()
            .setTitle(`${emotes.safe} Ban Koruma`)
            .setDescription(`> ${entry.executor} yetkilisi **<t:${Math.floor(Date.now() / 1000)}:f>** tarihinde **ban kaldırdı** ve gerekli işlemler uygulandı.`)
            .addFields([
                { name: "Yetkili ↷", value: "```" + `${entry.executor.tag} | ${entry.executor.id}` + "```" },
                { name: "Kullanıcı ↷", value: "```" + `${member.user.username} | ${member.user.id}` + "```", inline: true },
                { name: "Yetkili Limiti ↷", value: "```" + String(`${Number(unban_limit.limit)}/${Number(userData?.memberUnBan || 0)}`) + "```", inline: true },
            ])
            .setThumbnail(guild.iconURL({ dynamic: true }))
            .setFooter({ text: entry.executor.tag, iconURL: entry.executor.avatarURL({ dynamic: true }) })
            .setColor(Colors.Blurple)

        log
            ?.send({ embeds: [embed] })
            .catch(() => { })
    }

    if (Number(userData?.memberUnBan || 0) >= Number(unban_limit.limit)) {
        if (log) {
            const embed = new EmbedBuilder()
                .setTitle(`${emotes.uyarı} Dikkat!`)
                .setDescription(`> ${entry.executor} yetkilisi **<t:${Math.floor(Date.now() / 1000)}:f>** tarihinde **üye koruma** limitine ulaştı ve cezalandırıldı.`)
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
            .updateOne({ guildID: guild.id, userID: entry.executor.id }, { $set: { "memberGuard.memberUnBan": 0 } }, { upsert: true })
            .then(async () => await guildModel
                .updateOne({ guildID: guild.id }, { $push: { infos: { type: "Ban Kaldırma", userID: entry.executor.id, time: Date.now(), jail: true } } }, { upsert: true }))
    } else {
        await guildModel
            .updateOne({ guildID: guild.id }, { $push: { infos: { type: "Ban Kaldırma", userID: entry.executor.id, time: Date.now(), jail: false } } }, { upsert: true })
    }
};
module.exports.conf = {
    name: "guildBanRemove",
};