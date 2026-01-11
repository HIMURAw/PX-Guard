const {
  SlashCommandBuilder,
  ChannelType,
  PermissionsBitField
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("logkur")
    .setDescription("Guard log sistemi için kategori ve kanalları otomatik kurar"),

  async execute(interaction) {
    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      )
    ) {
      return interaction.reply({
        content: "Bu komutu kullanmak için **Yönetici** yetkisine sahip olmalısın.",
        flags: 64,
      });
    }

    const guild = interaction.guild;

    await interaction.reply({
      content: "Log sistemi kuruluyor...",
      ephemeral: true,
    });

    // ================== CATEGORY ==================
    const category = await guild.channels.create({
      name: "⚫PXDEV | Logs",
      type: ChannelType.GuildCategory,
    });

    // ================== CHANNELS ==================
    const channelMap = {
      channelLog: "⚫・channel-log",
      emojiLog: "⚫・emoji-log",
      banLog: "⚫・ban-log",
      unbanLog: "⚫・unban-log",
      joinLog: "⚫・join-log",
      leaveLog: "⚫・leave-log",
      messageLog: "⚫・message-log",
      voiceLog: "⚫・voice-log",
      roleLog: "⚫・role-log",
      dailyInfoLogChannelID: "⚫・daily-info-log",
    };

    const created = {};

    for (const [key, name] of Object.entries(channelMap)) {
      const channel = await guild.channels.create({
        name,
        type: ChannelType.GuildText,
        parent: category.id,
        permissionOverwrites: [
          {
            id: guild.roles.everyone,
            deny: [PermissionsBitField.Flags.SendMessages],
          },
        ],
      });

      created[key] = channel.id;
    }

    // ================== CONFIG OUTPUT ==================
    const configText =
      `bots_logs: {
  channelLog: "${created.channelLog}",
  emojiLog: "${created.emojiLog}",
  banLog: "${created.banLog}",
  unbanLog: "${created.unbanLog}",
  joinLog: "${created.joinLog}",
  leaveLog: "${created.leaveLog}",
  messageLog: "${created.messageLog}",
  voiceLog: "${created.voiceLog}",
  roleLog: "${created.roleLog}",
  dailyInfoLogChannelID: "${created.dailyInfoLogChannelID}",
}`

    // ================== SEND TO FIRST CHANNEL ==================
    const firstChannel = guild.channels.cache.get(created.channelLog);

    await firstChannel.send({
      content: "```js\n" + configText + "\n```",
    });

    // ================== DONE ==================
    await interaction.followUp({
      content:
        "Log sistemi kuruldu.\nİlk kanala **config.js** için hazır kod bırakıldı. Kopyala-yapıştır yap.",
      ephemeral: true,
    });
  },
};
