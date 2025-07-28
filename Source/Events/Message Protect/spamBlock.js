const { guard_config: { badwords, shortBadwords }, emotes } = require("../../../config.js");
const { EmbedBuilder, PermissionFlagsBits, AuditLogEvent } = require("discord.js");
const leax = (A, B) => { return Math.floor((A * 100) / B) };
const guildModel = require("../../Models/guildSchema");
const userModel = require("../../Models/userSchema");
var moment = require("moment");
let cooldownBot = new Map()
const bot = global.guard;

module.exports = async (message) => {
  if (message?.author?.bot || !message?.guild || !message?.content) return;

  let raidStart = await message.channel.messages.cache
    .filter(x => x?.author?.id === message?.author?.id)
    .filter(x => x?.createdTimestamp >= (Date.now() - 7000))

  if (raidStart.size > 6) {
    if (message.member.permissions.has(PermissionFlagsBits.ManageMessages) || await bot.checkUser(["MESSAGE_PROTECT"], message.guild, message.author.id)) return;

    message.member
      ?.timeout(1 * 60 * 1000, 'Spam Koruması limitine takıldı.')
      .catch(() => { })

    message.channel.messages.cache
      .filter(x => x.author.id === message.author.id)
      .sort((a, b) => b.createdTimestamp - a.createdTimestamp)
      .filter(x => x?.createdTimestamp >= (Date.now() - 10000))
      .map((x) => x
        ?.delete()
        .catch(() => { }))

    if (!cooldownBot.get(message.author.id)) {
      cooldownBot
        .set(message.author.id, true)

      message.channel
        .send({ content: `> ${emotes.uyarı} **Dur!** ${message.author}, spam yaptığını tespit ettim ve cezalandırıldın.` })
        .then((x) => {
          setTimeout(() => {
            x
              .delete()
              .catch(() => { })

            cooldownBot
              .delete(message.author.id)
          }, 10000)
        })
    }
  }
};
module.exports.conf = {
  name: "messageCreate",
};
