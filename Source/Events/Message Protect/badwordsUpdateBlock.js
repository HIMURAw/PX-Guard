const { guard_config: { badwords, shortBadwords }, emotes } = require("../../../config.js");
const { EmbedBuilder, PermissionFlagsBits, AuditLogEvent } = require("discord.js");
const guildModel = require("../../Models/guildSchema");
const userModel = require("../../Models/userSchema");
const bot = global.guard;

module.exports = async (oldMessage, newMessage) => {
  if (newMessage?.author?.bot || !newMessage?.guild || !newMessage?.content) return;

  let messageSplit = newMessage.content.toLowerCase().split(" ")
  if (badwords.some(word => newMessage.content.toLowerCase().includes(word))) {
    if (newMessage.member.permissions.has(PermissionFlagsBits.ManageMessages) || await bot.checkUser(["MESSAGE_PROTECT"], newMessage.guild, newMessage.author.id)) return;

    newMessage.channel
      .send({ content: `> ${emotes.uyarı} **Dur!** ${newMessage.author}, mesajında küfür tespit ettim, sözlerine dikkat et!` })
      .then((x) => {
        newMessage
          .delete()
          .catch(() => { })

        setTimeout(() => x
          .delete()
          .catch(() => { }), 5000)
      })
      .catch(() => { })
  }

  if (shortBadwords.some(word => messageSplit.includes(word))) {
    if (newMessage.member.permissions.has(PermissionFlagsBits.ManageMessages) || await bot.checkUser(["MESSAGE_PROTECT"], message.guild, message.author.id)) return;

    newMessage.channel
      .send({ content: `> ${emotes.uyarı} **Dur!** ${newMessage.author}, mesajında küfür tespit ettim, sözlerine dikkat et!` })
      .then((x) => {
        newMessage
          .delete()
          .catch(() => { })

        setTimeout(() => x
          .delete()
          .catch(() => { }), 5000)
      })
      .catch(() => { })
  }
};
module.exports.conf = {
  name: "messageUpdate",
};
