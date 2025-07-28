
const { EmbedBuilder, Colors, ButtonStyle, ButtonBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const guildModel = require("../../../Models/guildSchema")
const { emotes } = require("../../../../config.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("güvenilir")
    .setDescription("Anti raid sisteminden etkilenmemesi için bota izin verirsiniz.")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("bot-ekle")
        .setDescription("Sunucuya eklendiğinde korumadan etkilenmiyecek botları eklersiniz.")
        .addUserOption((option) =>
          option
            .setName("bot")
            .setDescription("İzin verilecek bot.")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("bot-kaldır")
        .setDescription("Sisteme eklenen botları kaldırırsınız.")
        .addUserOption((option) =>
          option
            .setName("bot")
            .setDescription("Sistemden kaldırlacak bot.")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("bot-liste")
        .setDescription("Sisteme eklenen botları görüntülersiniz.")
    ),
  name: "güvenilir",
  usage: "/güvenilir",
  description: "güvenilir komutu.",
  async execute(interaction, bot) {
    if (interaction.user.id === interaction.guild.ownerId) {
      const guildFind = await guildModel.findOne({ guildID: interaction.guild.id });
      let allowBots = guildFind ? guildFind.allowBots?.map((x) => x.botId) || [] : [];

      let user = interaction.options.getUser("bot");
      if (interaction.options.getSubcommand() === "bot-liste") {
        if (allowBots.length > 0) {
          let bots = guildFind?.allowBots?.map((x, index) => `\`${(index++) + 1}.\` Bot ID: **${x.botId}** Ekleyen Yetkili: **<@!${x.staffId}>**`);

          const embed = new EmbedBuilder()
            .setTitle(`${emotes.mavikelebek} Bot Listesi`)
            .setDescription(bots.join("\n"))
            .setColor("Blurple")

          return interaction
            .reply({ embeds: [embed] })
            .catch(() => { });
        } else {
          return interaction
            .reply({
              content: `> ${emotes.başarısız} **Başarısız!** Sisteme eklenmiş bot bulunmuyor.`, flags: 64
            })
            .catch(() => { });
        }
      }

      if (interaction.options.getSubcommand() === "bot-kaldır") {
        if (allowBots.length > 0) {
          if (!allowBots.includes(user.id))
            return interaction
              .reply({
                content: `> ${emotes.başarısız} **Başarısız!** Belirttiğiniz ID sistemde bulunmuyor.`, flags: 64
              })
              .catch(() => { });

          await guildModel
            .updateOne({ guildID: interaction.guild.id }, { $pull: { allowBots: { botId: user.id }, }, }, { upsert: true });

          interaction
            .reply({ content: `> ${emotes.başarılı} **Başarılı!** Belirttiğiniz bot ID'si sistemden silindi. **Bot:** \`${user.username}\`` })
            .catch(() => { });

          return;
        } else {
          return interaction
            .reply({
              content: `> ${emotes.başarısız} **Başarısız!** Sisteme eklenmiş bot bulunmuyor.`, flags: 64
            })
            .catch(() => { });
        }
      }

      if (interaction.options.getSubcommand() === "bot-ekle") {
        if (user.bot !== true)
          return interaction
            .reply({
              content: `> ${emotes.başarısız} **Başarısız!** Eklemeye çalıştığınız ID bir bota sahip değil.`, flags: 64
            })
            .catch(() => { });

        if (allowBots?.includes(user.id)) {
          return interaction
            .reply({
              content: `> ${emotes.başarısız} **Başarısız!** Belirttiğiniz ID zaten sistemde bulunuyor.`, flags: 64
            })
            .catch(() => { });
        }

        await guildModel
          .updateOne({ guildID: interaction.guild.id }, { $push: { allowBots: { botId: user.id, staffId: interaction.user.id }, }, }, { upsert: true });

        const embed = new EmbedBuilder()
          .setTitle(`${emotes.başarılı} Başarılı!`)
          .setDescription(`> Belirttiğiniz bot sisteme eklendi. Bot sunucuya eklendiğinde atılmayacak.`)
          .addFields([{ name: `Yetkili ↷`, value: "```" + interaction.user.username + " | " + interaction.user.id + "```" }, { name: `Bot ↷`, value: "```" + user.username + " | " + user.id + "```" }])
          .setColor("Green");

        interaction
          .reply({ embeds: [embed] })
          .catch(() => { });

        return;
      }
    } else {
      interaction
        .reply({
          content: `> ${emotes.başarısız} **Başarısız!** Bu komutu sadece **sunucu sahibi** kullanabilir.`, flags: 64
        })
        .catch(() => { })

      return;
    }
  },
};
