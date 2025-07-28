// events/channelDelete.js
const { AuditLogEvent } = require('discord.js');
module.exports = async (channel) => {
    const fetchedLogs = await channel.guild.fetchAuditLogs({ type: AuditLogEvent.ChannelDelete, limit: 1 });
    const entry = fetchedLogs.entries.first();

    if (!entry || !entry.executor) return;

    const isTrusted = await isUserWhitelisted(entry.executor.id);
    if (isTrusted) return;

    // kanal geri oluştur
    channel.guild.channels.create({
        name: channel.name,
        type: channel.type,
        topic: channel.topic,
        parent: channel.parent,
        position: channel.position
    });

    // cezalandır
    channel.guild.members.ban(entry.executor.id, { reason: "İzinsiz kanal silme." });

    // log gönder
    sendLog(`🚨 ${entry.executor.tag} adlı kullanıcı izinsiz bir kanal sildi! Kanal geri oluşturuldu.`);
};
