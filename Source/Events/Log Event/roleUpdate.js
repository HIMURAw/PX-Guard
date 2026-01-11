module.exports = async (client, oldRole, newRole) => {
    const embedBuilder = require("../../utils/embeds");

    if (client.channelLogs?.roleLog) {
        await client.channelLogs.roleLog.send({
            embeds: [embedBuilder.roleU(client, newRole, oldRole)],
        });
    }
};
