module.exports = async (client, channel) => {
  const embedBuilder = require("../../utils/embeds");

  if (client.channelLogs?.channelLog) {
    await client.channelLogs.channelLog.send({
      embeds: [embedBuilder.channelC(client, channel)],
    });
  }
};
