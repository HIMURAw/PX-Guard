const { readdirSync } = require("fs");
const path = require("path");

module.exports = (client) => {
    const eventsPath = path.join(__dirname, "..", "events");

    for (const file of readdirSync(eventsPath).filter(f => f.endsWith(".js"))) {
        const eventName = file.split(".")[0];
        const event = require(path.join(eventsPath, file));

        client.on(eventName, (...args) => event(client, ...args));
        console.log(`[EVENT YÜKLENDİ] ${eventName}`);
    }
};
