module.exports = async (client, emoji) => {
  const embedBuilder = require("../../utils/embeds");

  if (client.channelLogs?.emojiLog) {
    await client.channelLogs.emojiLog.send({
      embeds: [embedBuilder.emojiD(client, emoji)],
    });
  }
};
