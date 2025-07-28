const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ApplicationCommandOptionType } = require("discord.js");
const { bots_config: { guard_system: { developersID } } } = require("../../../../config.js")

module.exports.run = async (bot, message, args, emotes) => {
  if (developersID.includes(message.author.id)) {
    try {
      var evaled = clean(await eval(args.slice(0).join(" ")));
      if (evaled.match(new RegExp(`${bot.token}`, "g"))) evaled;

      message.channel
        .send({ content: `\`\`\`js\n${evaled}\`\`\`` })
        .catch(() => { })
    } catch (err) {
      message.channel
        .send({ content: `\`\`\`js\n${err}\`\`\`` })
        .catch(() => { })
    }

    function clean(text) {
      if (typeof text !== "string")
        text = require("util").inspect(text, { depth: 0 });
      text = text
        .replace(/`/g, "`" + String.fromCharCode(8203))
        .replace(/@/g, "@" + String.fromCharCode(8203));
      return text;
    }
  }
};
module.exports.conf = {
  name: "eval",
  aliases: [],
};