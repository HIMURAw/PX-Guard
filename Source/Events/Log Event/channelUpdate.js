module.exports = async (client, oldChannel, newChannel) => {
  const embedBuilder = require("../../utils/embeds");

  if (oldChannel.name !== newChannel.name) {
    if (client.channelLogs?.channelLog) {
      await client.channelLogs.channelLog.send({
        embeds: [embedBuilder.channelUN(client, newChannel, oldChannel)],
      });
    }
  }

  if (oldChannel.nsfw !== newChannel.nsfw) {
    if (client.channelLogs?.channelLog) {
      await client.channelLogs.channelLog.send({
        embeds: [embedBuilder.channelUNSFW(client, newChannel, oldChannel)],
      });
    }
  }

  if (oldChannel.parent !== newChannel.parent) {
    if (client.channelLogs?.channelLog) {
      await client.channelLogs.channelLog.send({
        embeds: [embedBuilder.channelUP(client, newChannel, oldChannel)],
      });
    }
  }

  if (oldChannel.topic !== newChannel.topic) {
    if (client.channelLogs?.channelLog) {
      await client.channelLogs.channelLog.send({
        embeds: [embedBuilder.channelUT(client, newChannel, oldChannel)],
      });
    }
  }

  if (oldChannel.rateLimitPerUser !== newChannel.rateLimitPerUser) {
    if (client.channelLogs?.channelLog) {
      await client.channelLogs.channelLog.send({
        embeds: [embedBuilder.channelURPU(client, newChannel, oldChannel)],
      });
    }
  }
};
