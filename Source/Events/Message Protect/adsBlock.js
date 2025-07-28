const { EmbedBuilder, PermissionFlagsBits, AuditLogEvent } = require("discord.js");
const { guard_config: { ADS }, emotes } = require("../../../config.js");
const bot = global.guard;

module.exports = async (message) => {
  if (message?.author?.bot || !message?.guild || !message?.content) return;
  if (message.member.permissions.has(PermissionFlagsBits.ManageMessages) || await bot.checkUser(["MESSAGE_PROTECT"], message.guild, message.author.id)) return;
  const messageContent = message.content.toLowerCase();

  const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.gif', '.webp'];
  const TRUSTED_IMAGE_SOURCES = ['tenor.com', 'giphy.com', 'imgur.com', 'media.discordapp.net', 'cdn.discordapp.com'];
  const URL_REGEX = /https?:\/\/(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(?:\/[^\s]*)?/g;

  const containsUrl = URL_REGEX.test(messageContent);
  const isImageOrGif = IMAGE_EXTENSIONS.some((ext) => {
    const lastSegment = messageContent.split(' ').find((word) => word.match(/https?:\/\//));
    return lastSegment && lastSegment.split('?')[0].endsWith(ext);
  }) || TRUSTED_IMAGE_SOURCES.some((domain) => messageContent.includes(domain));

  if (containsUrl && !isImageOrGif) {
    message.channel
      .send({ content: `> ${emotes.uyarı} **Dur!** ${message.author}, mesajında reklam tespit ettim!` })
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
