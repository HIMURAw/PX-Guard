module.exports = async (client, oldMessage, newMessage) => {
  const embedBuilder = require("../../utils/embeds");
  const cfg = require("../../../config");

  if (newMessage.guild.id !== cfg.discord.serverId) return;
  // if (!newMessage.author) return;
  if (newMessage.author && newMessage.author.bot) return;
  // if (!oldMessage.author) return;

  if (client.channelLogs?.messageLog) {
    await client.channelLogs.messageLog.send({
      embeds: [embedBuilder.messageU(client, oldMessage, newMessage), embedBuilder.messageUN(client, oldMessage, newMessage)],
    });
  }
};
