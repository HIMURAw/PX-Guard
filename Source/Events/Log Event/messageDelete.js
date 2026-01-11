module.exports = async (client, message) => {
  const embedBuilder = require("../../utils/embeds");
  const cfg = require("../../../config");

  if (message.guild.id !== cfg.discord.serverId) return;
  // if (!message.author) return; // Allow uncached messages
  if (message.author && message.author.bot) return;

  if (client.channelLogs?.messageLog) {
    await client.channelLogs.messageLog.send({
      embeds: [embedBuilder.messageD(client, message)],
    });
  }
};
