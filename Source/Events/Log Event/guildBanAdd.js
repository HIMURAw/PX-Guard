module.exports = async (client, member, reason) => {
  const embedBuilder = require("../../utils/embeds");

  if (client.channelLogs?.banLog) {
    await client.channelLogs.banLog.send({
      embeds: [embedBuilder.guildBA(client, member, reason)],
    });
  }
};
