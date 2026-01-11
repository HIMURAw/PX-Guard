module.exports = async (client, member) => {
  const embedBuilder = require("../../utils/embeds");

  if (client.channelLogs?.joinLog) {
    await client.channelLogs.joinLog.send({
      embeds: [embedBuilder.guildMA(client, member)],
    });
  }
};
