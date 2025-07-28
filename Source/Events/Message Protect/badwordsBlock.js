const { guard_config: { badwords, shortBadwords }, emotes } = require("../../../config.js");
const { EmbedBuilder, PermissionFlagsBits, AuditLogEvent } = require("discord.js");
const bot = global.guard;

module.exports = async (message) => {
  if (message?.author?.bot || !message?.guild || !message?.content) return;

  let messageSplit = message.content.toLowerCase().split(" ")
  if (badwords.some(word => message.content.toLowerCase().includes(word))) {
    if (message.member.permissions.has(PermissionFlagsBits.ManageMessages) || await bot.checkUser(["MESSAGE_PROTECT"], message.guild, message.author.id)) return;

    message.channel
      .send({ content: `> ${emotes.uyarı} **Dur!** ${message.author}, mesajında küfür tespit ettim, sözlerine dikkat et!` })
      .then((x) => {
        message
          .delete()
          .catch(() => { })

        setTimeout(() => x
          .delete()
          .catch(() => { }), 5000)
      })
      .catch(() => { })
  }

  if (shortBadwords.some(word => messageSplit.includes(word))) {
    if (message.member.permissions.has(PermissionFlagsBits.ManageMessages) || await bot.checkUser(["MESSAGE_PROTECT"], message.guild, message.author.id)) return;

    message.channel
      .send({ content: `> ${emotes.uyarı} **Dur!** ${message.author}, mesajında küfür tespit ettim, sözlerine dikkat et!` })
      .then((x) => {
        message
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
  name: "messageCreate",
};
