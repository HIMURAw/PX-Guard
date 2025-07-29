const { guard_config: { logChannelWebHook, dailyInfoLogChannelID, punishmentsType }, guard_config, emotes, server_config } = require("../../config.js");
const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, Colors, ButtonStyle, escapeBold, WebhookClient } = require("discord.js")
const { bots_config: { guard_system: { ownersId } }, genel_config, bots_config } = require("../../config.js");
const permissionsModel = require("../Models/PermissionsSchema");
const guildModel = require("../Models/guildSchema");
const userModel = require("../Models/userSchema");
const moment = require("moment")
const path = require('path');
const fs = require('fs');
const bot = global.guard;

bot.dailyInfo = async function () {
  let guildFind = await guildModel
    .find({})

  guildFind
    .map((x) => {
      let datas = x ? x.infos?.map((x) => x) : []
      let guild = bot.guilds.cache.get(x.guildID)

      let log = new WebhookClient({ url: logChannelWebHook });

      if (guild) {
        if (datas.length > 0) {
          if (log) {
            const dataArray = chunkArray(datas, 5);
            const totalPages = Math.ceil(dataArray.length / 5); // Split into chunks of 5 fields per embed
            const embeds = [];
            
            for (let i = 0; i < dataArray.length; i += 5) {
              const chunk = dataArray.slice(i, i + 5);
              const embed = new EmbedBuilder()
                .setTitle(`${emotes.safe} Günlük Koruma Verileri (Sayfa ${Math.floor(i/5) + 1}/${totalPages})`)
                .setDescription(`> Bugün toplam __**${datas.length} tane**__ izinsiz işlem engellendi. Bu işlemleri yapan yetkililerden sadece __**${datas.filter((x) => x.jail).length} tanesi**__ ceza aldı.`)
                .setThumbnail(guild.iconURL({ dynamic: true }))
                .setColor("Aqua");

              chunk.forEach((x, index) => {
                embed.addFields({
                  name: `Grup ${i + index + 1} (${(i + index + 1) * x.length}/${datas.length})`,
                  value: x
                    .map((x) => `**╰** Kullanıcı: <@!${x.userID}> ${x.jail ? `__**CEZALANDIRILMIŞ!**__ ${emotes.uyarı}` : ""}\n**╰** Yapılan İşlem: **${x.type}**\n**╰** İşlem Zamanı: **<t:${Math.floor(x.time / 1000)}:f>**`)
                    .join("\n\n")
                });
              });
              
              embeds.push(embed);
            }

            // Send all embeds
            embeds.forEach((embed, index) => {
              setTimeout(() => {
                log.send({ embeds: [embed] }).catch(console.error);
              }, index * 1000); // 1 second delay between embeds
            });

            // Clear the data after sending
            guildModel
              .updateMany({ guildID: guild.id }, { infos: [] }, { upsert: true })
              .then(() => userModel.deleteMany({ guildID: guild.id }))
              .catch(console.error);
          }
        } else {
          if (log) {
            let embed = new EmbedBuilder()
              .setTitle(`${emotes.safe} Günlük Koruma Verileri`)
              .setDescription(`> Bugün sunucuda izinsiz bir işlem olmadı. Atkif olarak toplam __**${guild.channels.cache.size} tane** kanal__, __**${guild.roles.cache.size} tane** rol__ korunuyor. Merak etmeyin sunucu bana emanet. 🫡`)
              .setThumbnail(guild.iconURL({ dynamic: true }))
              .setColor("Aqua")

            log
              ?.send({ embeds: [embed] })
              .catch(() => { })
          }
        }
      }
    })

  function chunkArray(array, chunkSize) {
    const result = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      result.push(array.slice(i, i + chunkSize));
    }
    return result;
  }
}

bot.checkPermissions = async function checkPermissions(permissions, interaction, user, checkMsg, flags) {
  permissions = permissions || [];
  let permissionsFind = await permissionsModel.find({ guildID: interaction.guild.id })
  let checkUserFind = permissionsFind ? permissionsFind
    ?.filter((x) => x?.userID ? true : false)
    ?.find((x) => x?.userID == user) || [] : []
  let checkUserData = checkUserFind ? checkUserFind?.permissions?.map((x) => x) || [] : []
  let checkPerms = checkUserData
    ?.filter((x) => x.type == "guard")
    ?.map((x) => x)

  let checkRoleData = []
  permissionsFind ? permissionsFind
    ?.filter((x) => x?.roleID ? true : false)
    ?.filter((x) => x?.permissions ? x?.permissions?.length > 0 ? true : false : false)
    ?.map((x) => x?.permissions.map((x) => checkRoleData.push(x))) || [] : []
  let checkRolePerms = checkRoleData
    ?.filter((x) => x.type == "guard")
    ?.map((x) => x)

  let bots = global.bots
  let member = interaction.guild.members.cache.get(user)

  if (ownersId.some((x) => x == user)) return false;
  if (permissions.some((x) => x.includes("BOT_ALLOW_PERMISSIONS")) ? !server_config.permissions.some((x) => x == user) : false) {
    if (checkMsg) {
      let error = new EmbedBuilder()
        .setTitle(`${emotes.başarısız} Başarısız!`)
        .setDescription(`> Bu komutu kullanmak için **yeterli** yetkiniz bulunmuyor.`)
        .setThumbnail(member ? member?.user.displayAvatarURL({ dynamic: true }) : "")
        .addFields([{ name: "Request Permissions ↷", value: `\`\`\`diff\n${permissions.map((x) => `- ${x}`)}\`\`\`` }])
        .setColor("Red")

      let button2 = new ButtonBuilder({ style: ButtonStyle.Link, label: "discord.gg/soulroleplay", url: genel_config.inviteURL })
      let button1 = new ButtonBuilder({ style: ButtonStyle.Danger, emoji: { id: "928282667273826355" }, customId: "delete_message" })

      await interaction
        ?.reply({ embeds: [error], components: [new ActionRowBuilder({ components: [button1, button2] })], flags: flags })
        .then((msg) => setTimeout(() => msg
          ?.delete()
          ?.catch(() => { }), 1000 * 60 * 1))
        .catch(() => { })
    }

    return true;
  }

  if (interaction?.guild?.ownerId !== user) {
    if (!bots.some((x) => x?.user?.id == user)) {
      if (!server_config.permissions.some((x) => x == user)) {
        if (!checkPerms.some((perms) => perms?.id == "FULL")) {
          if (!bots_config.guard_system.ownersId.some((x) => x == user)) {
            if (!bots_config.guard_system.developersID.some((x) => x == user)) {
              if (!permissions.some((x) => checkPerms.some((perms) => perms?.id == x))) {
                if (member ? !checkRolePerms.filter((perms) => perms?.id == "FULL").some((perms) => member?.roles?.cache.get(perms?.roleID)) : true) {
                  if (member ? !permissions.some((x) => checkRolePerms.filter((perms) => perms?.id == x).some((perms) => member?.roles?.cache.get(perms?.roleID))) : true) {
                    if (checkMsg) {
                      let error = new EmbedBuilder()
                        .setTitle(`${emotes.başarısız} Başarısız!`)
                        .setDescription(`> Bu komutu kullanmak için **yeterli** yetkiniz bulunmuyor.`)
                        .setThumbnail(member ? member?.user.displayAvatarURL({ dynamic: true }) : "")
                        .addFields([{ name: "Request Permissions ↷", value: `\`\`\`diff\n${permissions.map((x) => `- ${x}`)}\`\`\`` }])
                        .setColor("Red")

                      let button2 = new ButtonBuilder({ style: ButtonStyle.Link, label: "discord.gg/soulroleplay", url: genel_config.inviteURL })
                      let button1 = new ButtonBuilder({ style: ButtonStyle.Danger, emoji: { id: "928282667273826355" }, customId: "delete_message" })

                      await interaction
                        ?.reply({ embeds: [error], components: [new ActionRowBuilder({ components: [button1, button2] })], flags: flags })
                        .then((msg) => setTimeout(() => msg
                          ?.delete()
                          ?.catch(() => { }), 1000 * 60 * 1))
                        .catch(() => { })
                    }

                    return true;
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  return false;
}

bot.checkUser = async function checkUser(permissions, guild, user) {
  permissions = permissions || [];
  let permissionsFind = await permissionsModel.find({ guildID: guild.id })
  let checkUserFind = permissionsFind ? permissionsFind
    ?.filter((x) => x?.userID ? true : false)
    ?.find((x) => x?.userID == user) || { permissions: [] } : { permissions: [] };
  let checkUserData = (checkUserFind && Array.isArray(checkUserFind.permissions)) ? checkUserFind.permissions.map((x) => x) : [];
  let checkPerms = checkUserData
    ?.filter((x) => x.type == "guard")
    ?.map((x) => x)

  let checkRoleData = []
  permissionsFind ? permissionsFind
    ?.filter((x) => x?.roleID ? true : false)
    ?.filter((x) => x?.permissions ? x?.permissions?.length > 0 ? true : false : false)
    ?.map((x) => x?.permissions.map((x) => checkRoleData.push(x))) || [] : []
  let checkRolePerms = checkRoleData
    ?.filter((x) => x.type == "guard")
    ?.map((x) => x)

  let bots = global.bots
  let member = guild.members.cache.get(user)

  if (!(Array.isArray(bots_config.guard_system.developersID) && bots_config.guard_system.developersID.some((x) => x == user))) {
    if (!(Array.isArray(bots_config.guard_system.ownersId) && bots_config.guard_system.ownersId.some((x) => x == user))) {
      if (!(Array.isArray(server_config.permissions) && server_config.permissions.some((x) => x == user))) {
        if (guild?.ownerId !== user) {
          if (!(Array.isArray(bots) && bots.some((x) => x?.user?.id == user))) {
            if (!(Array.isArray(checkPerms) && checkPerms.some((perms) => perms?.id == "FULL"))) {
              if (!(Array.isArray(permissions) && permissions.some((x) => Array.isArray(checkPerms) && checkPerms.some((perms) => perms?.id == x)))) {
                if (member ? !(Array.isArray(checkRolePerms) && checkRolePerms.filter((perms) => perms?.id == "FULL").some((perms) => member?.roles?.cache.get(perms?.roleID))) : true) {
                  if (member ? !(Array.isArray(permissions) && permissions.some((x) => Array.isArray(checkRolePerms) && checkRolePerms.filter((perms) => perms?.id == x).some((perms) => member?.roles?.cache.get(perms?.roleID)))) : true) {
                    return false;
                  } else {
                    return "whitelist";
                  }
                } else {
                  return "whitelist";
                }
              } else {
                return "whitelist";
              }
            } else {
              return "whitelist";
            }
          } else {
            return "bot_perm";
          }
        } else {
          return "full_perm";
        }
      } else {
        return "full_perm"
      }
    } else {
      return "full_perm"
    }
  } else {
    return "full_perm"
  }
}

bot.moons = {
  "01": "Ocak",
  "02": "Şubat",
  "03": "Mart",
  "04": "Nisan",
  "05": "Mayıs",
  "06": "Haziran",
  "07": "Temmuz",
  "08": "Ağustos",
  "09": "Eylül",
  "10": "Ekim",
  "11": "Kasım",
  "12": "Aralık",
}

bot.ban = async function ban(type, guildId) {
  let guild = bot.guilds.cache.get(guildId)
  if (guild) {
    let member = guild.members.cache.get(type?.id)
    if (member) {
      if (punishmentsType.type == "jail") {
        member?.roles.cache
          ?.map((x) => member?.roles
            ?.remove(x)
            .catch(() => { }))

        member?.roles
          ?.add(punishmentsType.roleId)
          .catch(() => { })
      } else if (punishmentsType.type == "ban") {
        let time = `${moment.utc(Date.now() + Number(1000 * 60 * 60 * 3)).format("D") + ` ${bot.moons[moment.utc(Date.now() + Number(1000 * 60 * 60 * 3)).format("MM")]} ` + moment.utc(Date.now() + Number(1000 * 60 * 60 * 3)).format("YYYY")} ${moment.utc(Date.now() + Number(1000 * 60 * 60 * 3)).format("HH:mm")}`
        guild.members
          .ban(member.user.id, { reason: `Reason: Koruma Limiti Aşıldı | Staff: ${bot.user.tag} | Date: ${time}` })
          .catch(() => member?.roles.cache
            ?.map((x) => member?.roles
              ?.remove(x)
              .catch(() => { })))
      } else if (punishmentsType.type == "kick") {
        member
          ?.kick({ reason: `Reason: Koruma Limiti Aşıldı | Staff: ${bot.user.tag} | Date: ${time}` })
          .catch(() => member?.roles.cache
            ?.map((x) => member?.roles
              ?.remove(x)
              .catch(() => { })))
      } else {
        member?.roles.cache
          ?.map((x) => member?.roles
            ?.remove(x)
            .catch(() => { }))
      }
    }
  }

  return false;
}

bot.extractValues = function extractValues(obj = config, parentKey = "", seen = new WeakSet()) {
  if (seen.has(obj)) {
    console.warn("Circular reference detected for:", parentKey);
    return [];
  }
  seen.add(obj);

  let values = [];
  for (const key in obj) {
    const fullKey = parentKey ? `${parentKey}.${key}` : key;

    try {
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        values = values.concat(extractValues(obj[key], fullKey, seen));
      } else if (Array.isArray(obj[key])) {
        obj[key].forEach((item, index) => {
          const arrayKey = `${fullKey}[${index}]`;

          if (typeof item === 'object' && item !== null) {
            values = values.concat(extractValues(item, arrayKey, seen));
          } else {
            values.push({ target: arrayKey, value: item });
          }
        });
      } else {
        values.push({ target: fullKey, value: obj[key] });
      }
    } catch (error) {
      console.error("Error processing key:", fullKey, error);
    }
  }
  return values;
}

bot.updateConfigValueByValue = function updateConfigValueByValue(oldValue, newValue) {
  let filePath = path.join(__dirname, `../../../../config.js`);
  let configContent = fs.readFileSync(filePath, 'utf8');

  const regex = new RegExp(`(['"])(?:(?=(\\\\?))\\2.)*?\\b${oldValue}\\b(?:(?=(\\\\?))\\2.)*?\\1`, 'g');
  const updatedContent = configContent.replace(regex, match => match.replace(oldValue, newValue));

  if (configContent === updatedContent) return false;

  fs.writeFileSync(filePath, updatedContent, 'utf8');
  reloadConfig(filePath)

  function reloadConfig(filePath) {
    delete require.cache[require.resolve(filePath)];
    return require(filePath);
  }

  if (configContent !== updatedContent) return true
  else if (configContent === updatedContent) return false;
}
