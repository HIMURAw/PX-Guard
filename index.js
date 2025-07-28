const Config = require('./config.js');
const { Client, GatewayIntentBits, Partials } = require('discord.js');
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildBans,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.MessageContent
    ],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});

client.on('ready', () => {
    console.log(`Logged in as ${client.user.displayName}!`);
});
client.login(Config.discord.bottoken);