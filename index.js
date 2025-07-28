const moons = { "01": "Ocak", "02": "Şubat", "03": "Mart", "04": "Nisan", "05": "Mayıs", "06": "Haziran", "07": "Temmuz", "08": "Ağustos", "09": "Eylül", "10": "Ekim", "11": "Kasım", "12": "Aralık" }
const { bots_config: { guard_system: { mongoURL } }, bots_config: { guard_system: { playings }, } } = require("./config.js");
const { discord: { token }, discord: { guards_token } } = require("./config.js");
const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
const { fork } = require("child_process");
const mongoose = require("mongoose");
const moment = require("moment")
const path = require("path");
require('advanced-logs');
const { joinVoiceChannel } = require('@discordjs/voice');
const config = require('./config');
const voiceChannelIds = config.discord.voiceID;

const bot = (global.guard = new Client({ fetchAllMembers: true, allowedMentions: { parse: ["roles", "users", "everyone"], repliedUser: true, }, partials: [Partials.Message, Partials.Channel, Partials.Reaction], intents: 3276799 }));
console.setConfig({ background: false, timestamp: false });

let time = Date.now() + Number(1000 * 60 * 60 * 3);
bot.default_Cmd = new Collection();
let Guards = (global.Guards = []);
bot.slash_Cmd = new Collection();
bot.aliases = new Collection();
const fs = require("fs")

mongoose.set("strictQuery", true)
mongoose
    .connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        bot
            .login(token)
            .then(() => {
                console.success(`Guard (main) botu "${bot.user.tag}" ismiyle aktif edildi.`, `[${moment.utc(time).format("D") + ` ${moons[moment.utc(time).format("MM")]} ` + moment.utc(time).format("YYYY | HH:mm:ss")}]`)

                let index = 0;
                for (const token of guards_token) {
                    const Bot = new Client({ fetchAllMembers: true, allowedMentions: { parse: ["roles", "users", "everyone"], repliedUser: true, }, partials: ["MESSAGE", "CHANNEL", "REACTION"], intents: 32767, });

                    Bot.once("ready", async () => {
                        global.bots
                            ?.push(Bot)
                        Guards
                            .push(Bot);

                        let descriptionFetch = await Bot.application.fetch()
                        if (descriptionFetch.description !== config.genel_config.description) {
                            await Bot.application
                                .edit({ description: config.genel_config.description })
                                .catch(() => { })
                        }

                        const playing = playings[Math.floor(Math.random() * playings.length)];
                        Bot.user
                            .setPresence({ activities: [{ name: playing, type: 4 }], status: "idle" })

                        setInterval(() => {
                            const playing = playings[Math.floor(Math.random() * playings.length)];

                            Bot.user
                                .setPresence({ activities: [{ name: playing, type: 4 }], status: "idle" })
                        }, 30000);

                        // === SES KANALINA OTOMATİK GİRİŞ (YARDIMCI GUARD BOT) ===
                        const channel = Bot.channels.cache.get(voiceChannelIds);
                        if (!channel || channel.type !== 2) {
                            console.error('Ses kanalı bulunamadı veya bir ses kanalı değil!');
                            return;
                        }
                        const botMember = channel.guild.members.me;
                        const currentVoiceId = botMember && botMember.voice && botMember.voice.channelId;
                        if (currentVoiceId !== channel.id) {
                            joinVoiceChannel({
                                channelId: channel.id,
                                guildId: channel.guild.id,
                                adapterCreator: channel.guild.voiceAdapterCreator
                            });
                            if (currentVoiceId) {
                                console.log(`Yardımcı Guard bot başka bir ses kanalındaydı (${currentVoiceId}), şimdi ${channel.name} kanalına taşındı.`);
                            } else {
                                console.log(`Yardımcı Guard bot ${channel.name} ses kanalına bağlanıldı (veya tekrar girildi).`);
                            }
                        } else {
                            console.log(`Yardımcı Guard bot zaten ${channel.name} ses kanalında.`);
                        }
                    });

                    Bot.on('voiceStateUpdate', (oldState, newState) => {
                        if (newState.id !== Bot.user.id) return;
                        if (newState.channelId === voiceChannelIds) return;
                        const c = newState.guild.channels.cache.get(voiceChannelIds);
                        if (c && c.type === 2) joinVoiceChannel({
                            channelId: c.id,
                            guildId: c.guild.id,
                            adapterCreator: c.guild.voiceAdapterCreator
                        });
                    });

                    Bot.login(token)
                        .then(() => {
                            index++
                            console.success(`${index}. Guard (yardımcı) bot "${Bot.user.tag}" ismiyle aktif edildi.`, `[${moment.utc(time).format("D") + ` ${moons[moment.utc(time).format("MM")]} ` + moment.utc(time).format("YYYY | HH:mm:ss")}]`)

                            // if (Number(index) == guards_token.length) {
                            //     fs
                            //         .readdirSync(`${__dirname}/../../Fivem Bots/`)
                            //         .filter((file) => file.includes("Ticket System"))
                            //         .forEach((folder) => fs
                            //             .readdirSync(`${__dirname}/../../Fivem Bots/${folder}/`)
                            //             .filter((file) => file.includes("index.js"))
                            //             .forEach((file) => {
                            //                 require(`${__dirname}/../../Fivem Bots/${folder}/${file}`);
                            //             }))
                            // }
                        })
                        .catch((err) => {
                            console
                                .error(`Guard (yardımcı) botlarında hata tespit edildi. Lütfen geliştiriciye bu durumu bildirin.`, `[PXDev - Hata]`)
                            console
                                .log(err)
                        });
                };

                fs
                    .readdirSync(`${__dirname}/Source/Handlers/`)
                    .filter((file) => file.endsWith(".js"))
                    .forEach((file) => {
                        require(`${__dirname}/Source/Handlers/${file}`);
                    });

                // === SES KANALINA OTOMATİK GİRİŞ (ANA GUARD BOT) ===
                bot.on('ready', () => {
                    const channel = bot.channels.cache.get(voiceChannelIds);
                    if (!channel || channel.type !== 2) { // 2 = GUILD_VOICE
                        console.error('Ses kanalı bulunamadı veya bir ses kanalı değil!');
                        return;
                    }
                    const botMember = channel.guild.members.me;
                    const currentVoiceId = botMember && botMember.voice && botMember.voice.channelId;
                    if (currentVoiceId !== channel.id) {
                        joinVoiceChannel({
                            channelId: channel.id,
                            guildId: channel.guild.id,
                            adapterCreator: channel.guild.voiceAdapterCreator
                        });
                        if (currentVoiceId) {
                            console.log(`Bot başka bir ses kanalındaydı (${currentVoiceId}), şimdi ${channel.name} kanalına taşındı.`);
                        } else {
                            console.log(`${channel.name} ses kanalına bağlanıldı (veya tekrar girildi).`);
                        }
                    } else {
                        console.log(`Bot zaten ${channel.name} ses kanalında.`);
                    }
                });
                bot.on('voiceStateUpdate', (oldState, newState) => {
                    if (newState.id !== bot.user.id) return;
                    if (newState.channelId === voiceChannelIds) return;
                    const c = newState.guild.channels.cache.get(voiceChannelIds);
                    if (c && c.type === 2) joinVoiceChannel({
                        channelId: c.id,
                        guildId: c.guild.id,
                        adapterCreator: c.guild.voiceAdapterCreator
                    });
                });

                // === SES KANALINA OTOMATİK GİRİŞ (YARDIMCI GUARD BOTLAR) ===
                // for (const token of guards_token) {
                //   const Bot = new Client({ fetchAllMembers: true, allowedMentions: { parse: ["roles", "users", "everyone"], repliedUser: true, }, partials: ["MESSAGE", "CHANNEL", "REACTION"], intents: 32767, });
                //   Bot.once("ready", async () => { ... });
                //   Bot.on('voiceStateUpdate', ...);
                // }
            })
            .catch((err) => {
                console
                    .error(`Guard botunda hata tespit edildi. Lütfen geliştiriciye bu durumu bildirin.`, `[PXDev - Hata]`)
                console
                    .log(err)
            });

        console.debug(`DataBase bağlantısı başarılı! Guard (main) bot aktif ediliyor...`, "[GUARD DATABASE]")
    })
    .catch((err) => console.log(`[${moment.utc(time).format("D") + ` ${moons[moment.utc(time).format("MM")]} ` + moment.utc(time).format("YYYY | HH:mm:ss")}] [GUARD DATABASE] Failed to login:\n` + err));  