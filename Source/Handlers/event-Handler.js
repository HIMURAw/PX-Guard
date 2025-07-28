const fs = require("fs");
const bot = global.guard;

fs.readdirSync(`${__dirname}/../Events/`).forEach((folder) => {
  const commandFiles = fs
    .readdirSync(`${__dirname}/../Events/${folder}/`)
    .filter((file) => file.endsWith(".js"));

  commandFiles.forEach((file) => {
    const event = require(`${__dirname}/../Events/${folder}/${file}`);
    bot.on(event.conf.name, event);
  });
});
