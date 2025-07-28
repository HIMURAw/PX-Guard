const { EmbedBuilder, MessageButton, MessageActionRow, MessageFlags } = require("discord.js");
const { emotes } = require("../../../config.js");
const bot = global.guard;

module.exports = async (interaction) => {
  if (interaction?.isChatInputCommand()) {
    const command = bot.slash_Cmd.get(interaction.commandName)
    if (!command) return;

    if (!interaction.guild)
      return interaction
        .reply({
          content: `:x:`, flags: 64
        })
        .catch(() => { })

    try {
      await command.execute(interaction, bot, emotes);
    } catch (err) {
      if (err) console.error(err);
    }
  } else if (interaction?.isAutocomplete()) {
    const command = bot.slash_Cmd.get(interaction.commandName)
    if (!command) return;

    try {
      await command.autocomplete(interaction, bot, emotes);
    } catch (error) {
      if (err) console.error(err);
    }
  } else if (interaction?.isButton()) {
    if (String(String(interaction?.customId).split("_")[0]) == "delete") {
      if (String(String(interaction?.customId).split("_")[1]) == "message") {

        if (interaction.message.flags.has(MessageFlags.Ephemeral)) {
          await interaction
            ?.update({ content: `> ${emotes.mavikelebek} **Özel Mesaj!** Bu bir özel mesaj, bu mesajı silemem. Senin silmen gerek ${emotes.tosun}\n-# Nerden silineceğini bulamadıysan burdan ↷`, embeds: [], components: [] })
            .catch(() => { })
        } else {
          await interaction?.message
            ?.delete()
            .catch(() => { })
        }
      }
    }
  }
};
module.exports.conf = {
  name: "interactionCreate",
};
