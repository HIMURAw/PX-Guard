module.exports = async (client, member) => {
  const embedBuilder = require("../../utils/embeds");

  if (client.channelLogs?.leaveLog) {
    await client.channelLogs.leaveLog.send({
      embeds: [embedBuilder.guildMR(client, member)],
    });
  }
};
