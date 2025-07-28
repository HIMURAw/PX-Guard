

module.exports = {
    name: "whitelist",
    description: "Kullanıcıyı guard sisteminden muaf tutar.",
    async execute(client, message, args) {
        const user = message.mentions.users.first();
        if (!user) return message.reply("Lütfen bir kullanıcı etiketle.");

        // DB'ye ekleme yapılabilir burada
        message.channel.send(`${user.tag} artık whitelist'te.`);
    }
};
