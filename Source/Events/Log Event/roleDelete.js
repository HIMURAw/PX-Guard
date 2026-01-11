module.exports = async (client, role) => {
    const embedBuilder = require("../../utils/embeds");

    if (client.channelLogs?.roleLog) {
        await client.channelLogs.roleLog.send({
            embeds: [embedBuilder.roleD(client, role)],
        });
    }
};
