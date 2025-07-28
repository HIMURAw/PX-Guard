const { Routes } = require("discord-api-types/v10");
const { REST } = require("@discordjs/rest");
const moment = require("moment");
const fs = require("fs");
const bot = global.guard;

const commands = [];
fs.readdirSync(`${__dirname}/../Commands/Slash Commands/`).forEach((folder) => {
  const commandFiles = fs
    .readdirSync(`${__dirname}/../Commands/Slash Commands/${folder}/`)
    .filter((file) => file.endsWith(".js"));

  commandFiles.forEach((file) => {
    const command = require(`${__dirname}/../Commands/Slash Commands/${folder}/${file}`);
    bot.slash_Cmd.set(command.data.name, command);
    commands.push(command.data.toJSON());
  });
});

bot.on("ready", () => {
  const CLIENT_ID = bot.user.id;

  const rest = new REST({ version: "10" }).setToken(bot.token);
  (async () => {
    try {
      await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });

      let time = Date.now() + Number(1000 * 60 * 60 * 3)
      //console.info(`Successfully reloaded application (/) ${commands.length} commands commands.`, `[${moment.utc(time).format("D") + ` ${bot.moons[moment.utc(time).format("MM")]} ` + moment.utc(time).format("YYYY | HH:mm:ss")}] [BOT]`);
    } catch (error) {
      console.log(error);
    }
  })();
});