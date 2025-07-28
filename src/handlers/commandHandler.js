const { readdirSync } = require("fs");
const path = require("path");

module.exports = (client) => {
    client.commands = new Map();

    const commandsPath = path.join(__dirname, "..", "commands");

    for (const folder of readdirSync(commandsPath)) {
        const folderPath = path.join(commandsPath, folder);
        for (const file of readdirSync(folderPath).filter(f => f.endsWith(".js"))) {
            const command = require(path.join(folderPath, file));
            if (!command.name) continue;
            client.commands.set(command.name, command);
            console.log(`[KOMUT YÜKLENDİ] ${command.name}`);
        }
    }
};
