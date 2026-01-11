module.exports = async (client, member, reason) => {
  const embedBuilder = require("../../utils/embeds");

  if (client.channelLogs?.unbanLog) {
    await client.channelLogs.unbanLog.send({
      embeds: [embedBuilder.guildBR(client, member, reason)],
    });
  }
};
