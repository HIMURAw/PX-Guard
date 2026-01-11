module.exports = async (client, oldState, newState) => {
  if (!client.channelLogs?.voiceLog) return;

  const logChannel = client.channelLogs.voiceLog;
  if (!logChannel) return;

  const embedBuilder = require("../../utils/embeds");

  if (!oldState.channel && newState.channel) {
    if (logChannel) {
      await logChannel.send({
        embeds: [embedBuilder.voiceJ(client, oldState, newState)],
      });
    }
  }

  if (oldState.channel && !newState.channel) {
    if (logChannel) {
      await logChannel.send({
        embeds: [embedBuilder.voiceL(client, oldState, newState)],
      });
    }
  }

  if (oldState.selfMute !== newState.selfMute) {
    if (logChannel) {
      if (newState.selfMute) {
        await logChannel.send({
          embeds: [embedBuilder.voiceSM(client, oldState, newState)],
        });
      } else {
        await logChannel.send({
          embeds: [embedBuilder.voiceSUM(client, oldState, newState)],
        });
      }
    }
  }

  if (oldState.selfDeaf !== newState.selfDeaf) {
    if (logChannel) {
      if (newState.selfDeaf) {
        await logChannel.send({
          embeds: [embedBuilder.voiceSD(client, oldState, newState)],
        });
      } else {
        await logChannel.send({
          embeds: [embedBuilder.voiceSUD(client, oldState, newState)],
        });
      }
    }
  }
};
