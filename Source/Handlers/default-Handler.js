const fs = require("fs");
const bot = global.guard;

fs.readdirSync(`${__dirname}/../Commands/Default Commands/`).forEach((folder) => {
  const commandFiles = fs
    .readdirSync(`${__dirname}/../Commands/Default Commands/${folder}/`)
    .filter((file) => file.endsWith(".js"));

  commandFiles.forEach((file) => {
    const command = require(`${__dirname}/../Commands/Default Commands/${folder}/${file}`);
    bot.default_Cmd.set(command.conf.name.toLowerCase(), command);

    if (command.conf.aliases) {
      command.conf.aliases.forEach((aliase) => {
        bot.aliases.set(aliase.toLowerCase(), command.conf.name.toLowerCase());
      });
    }
  });
});