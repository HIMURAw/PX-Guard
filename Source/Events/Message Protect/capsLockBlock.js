const { guard_config: { badwords, shortBadwords }, emotes } = require("../../../config.js");
const { EmbedBuilder, PermissionFlagsBits, AuditLogEvent } = require("discord.js");
const leax = (A, B) => { return Math.floor((A * 100) / B) };
const guildModel = require("../../Models/guildSchema");
const userModel = require("../../Models/userSchema");
var moment = require("moment");
const bot = global.guard;

module.exports = async (message) => {
  if (message?.author?.bot || !message?.guild || !message?.content || message?.content?.length <= 5) return;

  let messageSplit = message?.content?.replace(/ /g, "").split("")
  let argüman = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", ".", "?", "!", "*", ";", ":", "(", ")", "[", "]", "{", "}", "-", "_", ":", "#", "@", "/", "&", "+", "*"]
  let total = 0

  if (messageSplit.length > 0) {
    if (message.member.permissions.has(PermissionFlagsBits.ManageMessages) || await bot.checkUser(["MESSAGE_PROTECT"], message.guild, message.author.id)) return;

    messageSplit
      .map((x) => {
        if (messageSplit
          .filter((data) => !argüman.includes(data))
          .filter((data) => data.toUpperCase() === x)
          .join("")) total++;
      })

    if (leax(total, message.content.length) >= 60) {
      message.channel
        .send({ content: `> ${emotes.uyarı} **Dur!** ${message.author}, mesajında çok fazla büyük harf kullanıyorsun!` })
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
  }
};
module.exports.conf = {
  name: "messageCreate",
};
