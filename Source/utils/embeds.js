const { EmbedBuilder } = require("discord.js");

module.exports = {
  // Event: channelCreate
  channelC: (client, channel) => {
    const channelCreate = new EmbedBuilder()
      .setColor(client.color)
      .setAuthor({
        name: `${client.user.username} | Yeni Kanal Oluşturuldu`,
        iconURL: client.user.displayAvatarURL({ size: 4096 }),
      })
      .setThumbnail(
        "https://cdn.discordapp.com/emojis/1138482145673871400.webp?size=96&quality=lossless"
      )
      .addFields(
        { name: `İsim`, value: `${channel.name}`, inline: true },
        { name: `ID`, value: `${channel.id}`, inline: true },
        { name: `Etiket`, value: `<#${channel.id}>`, inline: true },
        {
          name: `NSFW`,
          value: `${channel.nsfw ? "Evet :white_check_mark:" : "Hayır :x:"}`,
          inline: true,
        },
        {
          name: `Kanal Kategorisi`,
          value: `${channel.parent ? channel.parent.name : "Yok"}`,
          inline: true,
        },
        {
          name: `Oluşturulma Tarihi`,
          value: `<t:${parseInt(channel.createdAt / 1000)}:R>`,
          inline: true,
        }
      );

    return channelCreate;
  },

  // Event: channelDelete
  channelD: (client, channel) => {
    const channelDelete = new EmbedBuilder()
      .setColor(client.color)
      .setAuthor({
        name: `${client.user.username} | Kanal Silindi`,
        iconURL: client.user.displayAvatarURL({ size: 4096 }),
      })
      .setThumbnail(
        "https://cdn.discordapp.com/emojis/1138482145673871400.webp?size=96&quality=lossless"
      )
      .setDescription(
        `:white_check_mark: Kanal **#${channel.name}** silindi`
      )
      .addFields(
        { name: `İsim`, value: `${channel.name}`, inline: true },
        { name: `ID`, value: `${channel.id}`, inline: true },
        {
          name: `NSFW`,
          value: `${channel.nsfw ? "Evet :white_check_mark:" : "Hayır :x:"}`,
          inline: true,
        }
      );

    return channelDelete;
  },

  // Event: channelPinsUpdate
  channelP: (client, channel) => {
    var date = Date.now();

    const channelPins = new EmbedBuilder()
      .setColor(client.color)
      .setAuthor({
        name: `${client.user.username} | Sabitlenen Mesaj Güncellemesi`,
        iconURL: client.user.displayAvatarURL({ size: 4096 }),
      })
      .setThumbnail(
        "https://cdn.discordapp.com/emojis/1138483813694046339.webp?size=96&quality=lossless"
      )
      .setDescription(`:pushpin: Mesaj sabitlendi veya sabiti kaldırıldı`)
      .addFields(
        { name: `Kanal`, value: `<#${channel.id}>`, inline: true },
        { name: `Kanal ID`, value: `${channel.id}`, inline: true },
        { name: `Tarih`, value: `<t:${parseInt(date / 1000)}:R>`, inline: true }
      );

    return channelPins;
  },

  // Event: channelUpdate
  channelUN: (client, newChannel, oldChannel) => {
    var date = Date.now();

    const channelUpdateName = new EmbedBuilder()
      .setColor(client.color)
      .setAuthor({
        name: `${client.user.username} | Yeni Kanal İsmi`,
        iconURL: client.user.displayAvatarURL({ size: 4096 }),
      })
      .setThumbnail(
        "https://cdn.discordapp.com/emojis/1138482145673871400.webp?size=96&quality=lossless"
      )
      .setDescription(
        [
          `### Kanal Bilgisi:`,
          `İsim: **${newChannel.name}**`,
          `Etiket: <#${newChannel.id}>`,
          `ID: **${newChannel.id}**`,
        ].join("\n")
      )
      .addFields(
        { name: `Eski`, value: `${oldChannel.name}`, inline: true },
        { name: `Yeni`, value: `${newChannel.name}`, inline: true },
        { name: `Tarih`, value: `<t:${parseInt(date / 1000)}:R>`, inline: true }
      );

    return channelUpdateName;
  },

  // Event: channelUpdate
  channelUNSFW: (client, newChannel, oldChannel) => {
    const channelNSFW = new EmbedBuilder()
      .setColor(client.color)
      .setAuthor({
        name: `${client.user.username} | Kanal Yaş Kısıtlaması Güncellendi`,
        iconURL: client.user.displayAvatarURL({ size: 4096 }),
      })
      .setDescription(
        [
          `### Kanal Bilgisi:`,
          `İsim: **${newChannel.name}**`,
          `Etiket: <#${newChannel.id}>`,
          `ID: **${newChannel.id}**`,
        ].join("\n")
      )
      .addFields(
        {
          name: `Eski Kısıtlama`,
          value: `${oldChannel.nsfw ? "Aktif :white_check_mark:" : "Devre Dışı :x:"
            }`,
          inline: true,
        },
        {
          name: `Yeni Kısıtlama`,
          value: `${newChannel.nsfw ? "Aktif :white_check_mark:" : "Devre Dışı :x:"
            }`,
          inline: true,
        }
      )
      .setTimestamp();

    return channelNSFW;
  },

  // Event: channelUpdate
  channelUP: (client, newChannel, oldChannel) => {
    var date = Date.now();

    const channelUpdateParent = new EmbedBuilder()
      .setColor(client.color)
      .setAuthor({
        name: `${client.user.username} | Kanal Kategorisi Değiştirildi`,
        iconURL: client.user.displayAvatarURL({ size: 4096 }),
      })
      .setThumbnail(
        "https://cdn.discordapp.com/emojis/1138488289846890557.webp?size=96&quality=lossless"
      )
      .setDescription(
        [
          `### Kanal Bilgisi:`,
          `İsim: **${newChannel.name}**`,
          `Etiket: <#${newChannel.id}>`,
          `ID: **${newChannel.id}**`,
        ].join("\n")
      )
      .addFields(
        {
          name: `Eski`,
          value: `${oldChannel.parent ? oldChannel.parent.name : "Yok :x:"}`,
          inline: true,
        },
        {
          name: `Yeni`,
          value: `${newChannel.parent ? newChannel.parent.name : "Yok :x:"}`,
          inline: true,
        },
        { name: `Tarih`, value: `<t:${parseInt(date / 1000)}:R>`, inline: true }
      );

    return channelUpdateParent;
  },

  // Event: channelUpdate
  channelUT: (client, newChannel, oldChannel) => {
    var date = Date.now();

    const channelUpdateTopic = new EmbedBuilder()
      .setColor(client.color)
      .setAuthor({
        name: `${client.user.username} | Kanal Konusu Değiştirildi`,
        iconURL: client.user.displayAvatarURL({ size: 4096 }),
      })
      .setThumbnail(
        "https://cdn.discordapp.com/emojis/1138482145673871400.webp?size=96&quality=lossless"
      )
      .setDescription(
        [
          `### Kanal Bilgisi:`,
          `İsim: **${newChannel.name}**`,
          `Etiket: <#${newChannel.id}>`,
          `ID: **${newChannel.id}**`,
        ].join("\n")
      )
      .addFields(
        {
          name: `Eski`,
          value: `${oldChannel.topic || `Yok :x:`}`,
          inline: true,
        },
        {
          name: `Yeni`,
          value: `${newChannel.topic || `Yok :x:`}`,
          inline: true,
        },
        { name: `Tarih`, value: `<t:${parseInt(date / 1000)}:R>`, inline: true }
      );

    return channelUpdateTopic;
  },

  // Event: channelUpdate
  channelURPU: (client, newChannel, oldChannel) => {
    var date = Date.now();

    const channelUpdateRatelimitPerUser = new EmbedBuilder()
      .setColor(client.color)
      .setAuthor({
        name: `${client.user.username} | Kanal Yavaş Modu Değiştirildi`,
        iconURL: client.user.displayAvatarURL({ size: 4096 }),
      })
      .setThumbnail(
        "https://cdn.discordapp.com/emojis/785483969453883432.webp?size=96&quality=lossless"
      )
      .setDescription(
        [
          `### Kanal Bilgisi:`,
          `İsim: **${newChannel.name}**`,
          `Etiket: <#${newChannel.id}>`,
          `ID: **${newChannel.id}**`,
        ].join("\n")
      )
      .addFields(
        {
          name: `Eski Yavaş Mod`,
          value: `${oldChannel.rateLimitPerUser || "Yok :x:"}`,
          inline: true,
        },
        {
          name: `Yeni Yavaş Mod`,
          value: `${newChannel.rateLimitPerUser || "Yok :x:"}`,
          inline: true,
        },
        { name: `Tarih`, value: `<t:${parseInt(date / 1000)}:R>`, inline: true }
      );

    return channelUpdateRatelimitPerUser;
  },

  // Event: emojiCreate
  emojiC: (client, emoji) => {
    var date = Date.now();

    const emojiCreate = new EmbedBuilder()
      .setColor(client.color)
      .setAuthor({
        name: `${client.user.username} | Yeni Emoji Eklendi`,
        iconURL: client.user.displayAvatarURL({ dynamic: 4096 }),
      })
      .setThumbnail(emoji.url)
      .addFields(
        { name: `İsim`, value: `${emoji.name}`, inline: false },
        { name: `ID`, value: `${emoji.id}`, inline: false },
        { name: `Tarih`, value: `<t:${parseInt(date / 1000)}:R>`, inline: false }
      );

    return emojiCreate;
  },

  // Event: emojiDelete
  emojiD: (client, emoji) => {
    var date = Date.now();

    const emojiDelete = new EmbedBuilder()
      .setColor(client.color)
      .setAuthor({
        name: `${client.user.username} | Emoji Silindi`,
        iconURL: client.user.displayAvatarURL({ size: 4096 }),
      })
      .setThumbnail(emoji.url)
      .addFields(
        { name: `İsim`, value: `${emoji.name}`, inline: false },
        { name: `ID`, value: `${emoji.id}`, inline: false },
        { name: `Tarih`, value: `<t:${parseInt(date / 1000)}:R>`, inline: false }
      );

    return emojiDelete;
  },

  // Event: roleCreate
  roleC: (client, role) => {
    var date = Date.now();

    const roleCreate = new EmbedBuilder()
      .setColor(client.color)
      .setAuthor({
        name: `${client.user.username} | Yeni Rol Oluşturuldu`,
        iconURL: client.user.displayAvatarURL({ size: 4096 }),
      })
      .addFields(
        { name: `İsim`, value: `${role.name}`, inline: true },
        { name: `ID`, value: `${role.id}`, inline: true },
        { name: `Renk`, value: `${role.hexColor}`, inline: true },
        { name: `Tarih`, value: `<t:${parseInt(date / 1000)}:R>`, inline: true }
      );

    return roleCreate;
  },

  // Event: roleDelete
  roleD: (client, role) => {
    var date = Date.now();

    const roleDelete = new EmbedBuilder()
      .setColor(client.color)
      .setAuthor({
        name: `${client.user.username} | Rol Silindi`,
        iconURL: client.user.displayAvatarURL({ size: 4096 }),
      })
      .addFields(
        { name: `İsim`, value: `${role.name}`, inline: true },
        { name: `ID`, value: `${role.id}`, inline: true },
        { name: `Renk`, value: `${role.hexColor}`, inline: true },
        { name: `Tarih`, value: `<t:${parseInt(date / 1000)}:R>`, inline: true }
      );

    return roleDelete;
  },

  // Event: roleUpdate
  roleU: (client, newRole, oldRole) => {
    var date = Date.now();

    const roleUpdate = new EmbedBuilder()
      .setColor(client.color)
      .setAuthor({
        name: `${client.user.username} | Rol Güncellendi`,
        iconURL: client.user.displayAvatarURL({ size: 4096 }),
      })
      .addFields(
        { name: `Eski İsim`, value: `${oldRole.name}`, inline: true },
        { name: `Yeni İsim`, value: `${newRole.name}`, inline: true },
        { name: `ID`, value: `${newRole.id}`, inline: true },
        { name: `Tarih`, value: `<t:${parseInt(date / 1000)}:R>`, inline: true }
      );

    return roleUpdate;
  },

  // Event: emojiUpdate
  emojiU: (client, newEmoji, oldEmoji) => {
    var date = Date.now();

    const emojiUpdate = new EmbedBuilder()
      .setColor(client.color)
      .setAuthor({
        name: `${client.user.username} | Emoji İsmi Değiştirildi`,
        iconURL: client.user.displayAvatarURL({ size: 4096 }),
      })
      .setThumbnail(newEmoji.url)
      .addFields(
        { name: `Yeni İsim`, value: `${oldEmoji.name}`, inline: false },
        { name: `Eski İsim`, value: `${newEmoji.name}`, inline: false },
        { name: `Tarih`, value: `<t:${parseInt(date / 1000)}:R>`, inline: false }
      );

    return emojiUpdate;
  },

  // Event: guildBanAdd
  guildBA: (client, member, reason) => {
    const guildBanAdd = new EmbedBuilder()
      .setColor(client.color)
      .setAuthor({
        name: `${client.user.username} | Üye Yasaklandı`,
        iconURL: client.user.displayAvatarURL({ size: 4096 }),
      })
      .setThumbnail(
        "https://cdn.discordapp.com/emojis/1117871692803494023.webp?size=96&quality=lossless"
      )
      .setDescription(
        [
          `**${member.user.username}** yasaklandı`,
          ``,
          `**İsim:** ${member.user.username}`,
          `**ID:** ${member.user.id}`,
        ].join("\n")
      )
      .setFooter({
        text: `Sebep: ${reason || "Yok"}`,
        iconURL: member.user.displayAvatarURL({ dynamic: true, size: 4096 }),
      })
      .setTimestamp();

    return guildBanAdd;
  },

  // Event: guildBanRemove
  guildBR: (client, member, reason) => {
    const guildBanRemove = new EmbedBuilder()
      .setColor(client.color)
      .setAuthor({
        name: `${client.user.username} | Üye Yasağı Kaldırıldı`,
        iconURL: client.user.displayAvatarURL({ size: 4096 }),
      })
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 4096 }))
      .setDescription(
        [
          `**${member.user.username}** yasağı kaldırıldı`,
          ``,
          `**Kullanıcı:**`,
          `**İsim:** ${member.user.username}`,
          `**ID:** ${member.user.id}`,
        ].join("\n")
      )
      .setTimestamp();

    return guildBanRemove;
  },

  // Event: guildMemberAdd
  guildMA: (client, member) => {
    var date = Date.now();

    const guildMemberAdd = new EmbedBuilder()
      .setColor(client.color)
      .setAuthor({
        name: `${member.user.username} sunucuya katıldı`,
        iconURL: member.user.displayAvatarURL({ dynamic: true, size: 4096 }),
      })
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 4096 }))
      .setDescription([`<@${member.user.id}> sunucuya katıldı`].join("\n"))
      .addFields(
        { name: `İsim`, value: `${member.user.username}`, inline: true },
        { name: `ID`, value: `${member.user.id}`, inline: true },
        { name: `Tarih`, value: `<t:${parseInt(date / 1000)}:R>`, inline: true }
      );

    return guildMemberAdd;
  },

  // Event: Member left
  guildMR: (client, member) => {
    var date = Date.now();

    const guildMemberRemove = new EmbedBuilder()
      .setColor(client.color)
      .setAuthor({
        name: `${member.user.username} | Sunucudan ayrıldı`,
        iconURL: member.user.displayAvatarURL({ dynamic: true, size: 4096 }),
      })
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 4096 }))
      .setDescription(
        [`**${member.user.username}** sunucudan ayrıldı`].join("\n")
      )
      .addFields(
        { name: `İsim`, value: `${member.user.username}`, inline: true },
        { name: `ID`, value: `${member.user.id}`, inline: true },
        { name: `Tarih`, value: `<t:${parseInt(date / 1000)}:R>`, inline: true }
      );

    return guildMemberRemove;
  },

  // Event: messageDelete
  messageD: (client, message) => {
    var date = Date.now();

    // Handle Uncached/Unknown Author
    const authorTag = message.author ? `${message.author.username}**/**${message.author.id}` : "Bilinmeyen Kullanıcı";
    const authorMention = message.author ? `<@${message.author.id}>` : "Bilinmeyen Kullanıcı";

    // Handle Missing Content
    const content = message.content ? message.content : "*İçerik önbellekte yok veya boş*";

    const messageDelete = new EmbedBuilder()
      .setColor(client.color)
      .setAuthor({
        name: `Mesaj Silindi`,
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      })
      .setThumbnail(
        "https://cdn.discordapp.com/emojis/830790543659368448.webp?size=96&quality=lossless"
      )
      .setDescription(
        [
          `### Mesaj İçeriği`,
          `\`\`\`${content}\`\`\``
        ].join("\n")
      )
      .addFields(
        {
          name: `Mesaj ID`,
          value: `${message.id}`,
          inline: false,
        },
        {
          name: `Yazar`,
          value: authorMention,
          inline: false,
        },
        {
          name: `Yazar Bilgisi`,
          value: authorTag,
          inline: false,
        },
        {
          name: `Kanal`,
          value: `<#${message.channel.id}>`,
          inline: false,
        },
        { name: `Tarih`, value: `<t:${parseInt(date / 1000)}:R>`, inline: true }
      );

    return messageDelete;
  },

  // Event: messageUpdate
  messageU: (client, oldMessage, newMessage) => {
    var date = Date.now();

    const content = oldMessage.content ? oldMessage.content : "*Eski içerik önbellekte yok*";

    const messageUpdate = new EmbedBuilder()
      .setColor(client.color)
      .setAuthor({
        name: `Mesaj Güncellendi (1/2)`,
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      })
      .setThumbnail(
        "https://cdn.discordapp.com/attachments/1142475983396536451/1181689429723717682/pencil.png?ex=6581f90a&is=656f840a&hm=e37d6a9945fa953a8dc8b9e3ff22965f28c203b5b2c5dd6f4c101a5e2c380938&"
      )
      .setDescription(
        [
          `### Eski Mesaj`,
          `\`\`\`${content}\`\`\``
        ].join("\n")
      )
      .addFields();

    return messageUpdate;
  },

  // Event: messageUpdate
  messageUN: (client, oldMessage, newMessage) => {
    var date = Date.now();

    // Handle Uncached/Unknown Author
    const authorTag = newMessage.author ? `${newMessage.author.username}**/**${newMessage.author.id}` : "Bilinmeyen Kullanıcı";
    const authorMention = newMessage.author ? `<@${newMessage.author.id}>` : "Bilinmeyen Kullanıcı";

    // Handle Missing Content
    const content = newMessage.content ? newMessage.content : "*İçerik önbellekte yok*";

    const messageUpdate = new EmbedBuilder()
      .setColor(client.color)
      .setAuthor({
        name: `Mesaj Güncellendi (2/2)`,
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      })
      .setThumbnail(
        "https://cdn.discordapp.com/attachments/1142475983396536451/1181689429723717682/pencil.png?ex=6581f90a&is=656f840a&hm=e37d6a9945fa953a8dc8b9e3ff22965f28c203b5b2c5dd6f4c101a5e2c380938&"
      )
      .setDescription(
        [
          `### Yeni Mesaj`,
          `\`\`\`${content}\`\`\``
        ].join("\n")
      )
      .addFields(
        {
          name: `Mesaj ID`,
          value: `${newMessage.id}`,
          inline: false,
        },
        {
          name: `Yazar`,
          value: authorMention,
          inline: false,
        },
        {
          name: `Yazar Bilgisi`,
          value: authorTag,
          inline: false,
        },
        {
          name: `Kanal`,
          value: `<#${newMessage.channel.id}>`,
          inline: false,
        },
        { name: `Tarih`, value: `<t:${parseInt(date / 1000)}:R>`, inline: true }
      );

    return messageUpdate;
  },

  // Event: voiceStateUpdate
  voiceJ: (client, oldState, newState) => {
    var date = Date.now();

    const voiceJoin = new EmbedBuilder()
      .setColor(client.color)
      .setAuthor({
        name: `${newState.member.user.username} | Sese Katıldı`,
        iconURL: newState.member.user.displayAvatarURL({
          dynamic: true,
          size: 4096,
        }),
      })
      .setThumbnail(
        "https://cdn.discordapp.com/attachments/1050740883319967764/1155814932999327814/1f50a.png"
      )
      .setDescription(
        `<@${newState.member.user.id}> ses kanalına **katıldı** <#${newState.channel.id}>`
      )
      .addFields({
        name: `Tarih`,
        value: `<t:${parseInt(date / 1000)}:R>`,
        inline: true,
      });

    return voiceJoin;
  },

  // Event: voiceStateUpdate
  voiceL: (client, oldState, newState) => {
    var date = Date.now();

    const voiceLeft = new EmbedBuilder()
      .setColor(client.color)
      .setAuthor({
        name: `${newState.member.user.username} | Sesten Ayrıldı`,
        iconURL: newState.member.user.displayAvatarURL({
          dynamic: true,
          size: 4096,
        }),
      })
      .setThumbnail(
        "https://cdn.discordapp.com/attachments/1050740883319967764/1155814932999327814/1f50a.png"
      )
      .setDescription(
        `<@${oldState.member.user.id}> ses kanalından **ayrıldı** <#${oldState.channel.id}>`
      )
      .addFields({
        name: `Tarih`,
        value: `<t:${parseInt(date / 1000)}:R>`,
        inline: true,
      });

    return voiceLeft;
  },

  // Event: voiceStateUpdate
  voiceSM: (client, oldState, newState) => {
    var date = Date.now();

    const voiceSelfMute = new EmbedBuilder()
      .setColor(client.color)
      .setAuthor({
        name: `${newState.member.user.username} | Kendini Susturdu`,
        iconURL: newState.member.user.displayAvatarURL({
          dynamic: true,
          size: 4096,
        }),
      })
      .setThumbnail(
        "https://cdn.discordapp.com/attachments/1050740883319967764/1155814932999327814/1f50a.png"
      )
      .setDescription(
        `<@${newState.member.user.id}> kanalında **kendini susturdu** <#${newState.channel.id}>`
      )
      .addFields({
        name: `Tarih`,
        value: `<t:${parseInt(date / 1000)}:R>`,
        inline: true,
      });

    return voiceSelfMute;
  },

  // Event: voiceStateUpdate
  voiceSUM: (client, oldState, newState) => {
    var date = Date.now();

    const voiceSelfUnmute = new EmbedBuilder()
      .setColor(client.color)
      .setAuthor({
        name: `${newState.member.user.username} | Susturmayı Kaldırdı`,
        iconURL: newState.member.user.displayAvatarURL({
          dynamic: true,
          size: 4096,
        }),
      })
      .setThumbnail(
        "https://cdn.discordapp.com/attachments/1050740883319967764/1155814932999327814/1f50a.png"
      )
      .setDescription(
        `<@${newState.member.user.id}> kanalında **susturmayı kaldırdı** <#${newState.channel.id}>`
      )
      .addFields({
        name: `Tarih`,
        value: `<t:${parseInt(date / 1000)}:R>`,
        inline: true,
      });

    return voiceSelfUnmute;
  },

  // Event: voiceStateUpdate
  voiceSD: (client, oldState, newState) => {
    var date = Date.now();

    const voiceSelfDeaf = new EmbedBuilder()
      .setColor(client.color)
      .setAuthor({
        name: `${newState.member.user.username} | Kendini Sağırlaştırdı`,
        iconURL: newState.member.user.displayAvatarURL({
          dynamic: true,
          size: 4096,
        }),
      })
      .setThumbnail(
        "https://cdn.discordapp.com/attachments/1050740883319967764/1155814932999327814/1f50a.png"
      )
      .setDescription(
        `<@${newState.member.user.id}> kanalında **kendini sağırlaştırdı** <#${newState.channel.id}>`
      )
      .addFields({
        name: `Tarih`,
        value: `<t:${parseInt(date / 1000)}:R>`,
        inline: true,
      });

    return voiceSelfDeaf;
  },

  // Event: voiceStateUpdate
  voiceSUD: (client, oldState, newState) => {
    var date = Date.now();

    const voiceSelfUndeaf = new EmbedBuilder()
      .setColor(client.color)
      .setAuthor({
        name: `${newState.member.user.username} | Sağırlaştırmayı Kaldırdı`,
        iconURL: newState.member.user.displayAvatarURL({
          dynamic: true,
          size: 4096,
        }),
      })
      .setThumbnail(
        "https://cdn.discordapp.com/attachments/1050740883319967764/1155814932999327814/1f50a.png"
      )
      .setDescription(
        `<@${newState.member.user.id}> kanalında **sağırlaştırmayı kaldırdı** <#${newState.channel.id}>`
      )
      .addFields({
        name: `Tarih`,
        value: `<t:${parseInt(date / 1000)}:R>`,
        inline: true,
      });

    return voiceSelfUndeaf;
  },
};
