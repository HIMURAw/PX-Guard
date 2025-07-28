const { EmbedBuilder, ButtonBuilder, MessageActionRow, PermissionFlagsBits, StringSelectMenuBuilder, ActionRowBuilder, ButtonStyle, Colors } = require("discord.js");
const { bots_config: { guard_system: { ownersId } }, genel_config } = require("../../../../config.js")
const permissionsModel = require("../../../Models/PermissionsSchema");
const { emotes } = require("../../../../config.js")
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("yetki")
        .setDescription("Kullanıcının bot üzerindeki yetkilerini düzenlersiniz.")
        .addSubcommand((subcommand) =>
            subcommand
                .setName("kullanici-ver")
                .setDescription("Belirtilen kullanıcının bot üzerinden izinlerini görüntülersiniz.")
                .addUserOption((option) =>
                    option
                        .setName("user")
                        .setDescription("İzinlerini değiştirmek istediğiniz kullanıcıyı seçin.")
                        .setRequired(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("rol-ver")
                .setDescription("Belirtilen rolün bot üzerinden izinlerini görüntülersiniz.")
                .addRoleOption((option) =>
                    option
                        .setName("role")
                        .setDescription("İzinlerini değiştirmek istediğiniz rolu seçin.")
                        .setRequired(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("listele")
                .setDescription("İzinli rolleri ve kullanıcıları görüntülersiniz.")
        ),
    async execute(interaction, bot) {
        if (await bot.checkPermissions(["BOT_ALLOW_PERMISSIONS"], interaction, interaction.user.id, true, true)) return;

        let subcom = interaction.options.getSubcommand()
        if (subcom == "kullanici-ver") {
            let user = interaction.options.getMember("user")
            if (!user) {
                let error = new EmbedBuilder()
                    .setTitle(`${emotes.başarısız} Başarısız!`)
                    .setDescription(`> Belirtilen kullanıcı sunucuda bulunmuyor yada geçersiz bir ID.`)
                    .setColor("Red")

                await interaction
                    .reply({ embeds: [error], flags: 64 })
                    .catch(() => { })

                return;
            }

            let userFind = await permissionsModel.findOne({ guildID: interaction.guild.id, userID: user.user.id })
            let userData = userFind ? userFind?.permissions?.map((x) => x) || [] : []
            let perms = []

            userData
                .map((x) => perms
                    .push({ type: x?.type, id: x?.id }))

            let embed = new EmbedBuilder()
                .setTitle(`${emotes.safe} İzin Paneli`)
                .setDescription(`> ${user} kullanıcısının güncel olarak **${perms?.filter((x) => x?.type == "guard").length} guard** yetkisi bulunuyor.`)
                .addFields([
                    {
                        name: "(Guard) Güncel Yetkiler ↷",
                        value: `\`\`\`diff\n${perms
                            .filter((x) => x.type == "guard")
                            .map((x) => x)
                            .length > 0 ? perms
                                .filter((x) => x.type == "guard")
                                .map((x) => `+ ${x?.id}`)
                                .join("\n") : "- NO_PERMISSION"}\`\`\``,
                        inline: true
                    },
                ])
                .setColor("Blue")

            let perms_guard = new StringSelectMenuBuilder({
                options: [
                    { label: "Tam yetki", description: "Tüm sistemlerde beyaz listeye alınır.", emoji: { id: "923848369854619658" }, value: "FULL", default: perms?.filter((x) => x.type == "guard")?.some((x) => x?.id === "FULL") ? true : false },
                    { label: "Kanal Koruma (Oluşturma)", description: "Kanal oluşturma korumasından muaf tutulur.", emoji: { id: "1185605494090518611" }, value: "CHANNEL_CREATE", default: perms?.filter((x) => x.type == "guard")?.some((x) => x?.id === "CHANNEL_CREATE") ? true : false },
                    { label: "Kanal Koruma (Silme)", description: "Kanal silme korumasından muaf tutulur.", emoji: { id: "1185605494090518611" }, value: "CHANNEL_DELETE", default: perms?.filter((x) => x.type == "guard")?.some((x) => x?.id === "CHANNEL_DELETE") ? true : false },
                    { label: "Kanal Koruma (Düzenleme)", description: "Kanal düzenleme korumasından muaf tutulur.", emoji: { id: "1185605494090518611" }, value: "CHANNEL_UPDATE", default: perms?.filter((x) => x.type == "guard")?.some((x) => x?.id === "CHANNEL_UPDATE") ? true : false },
                    { label: "Rol Koruma (Oluşturma)", description: "Rol oluşturma korumasından muaf tutulur.", emoji: { id: "917448428932464700" }, value: "ROLE_CREATE", default: perms?.filter((x) => x.type == "guard")?.some((x) => x?.id === "ROLE_CREATE") ? true : false },
                    { label: "Rol Koruma (Silme)", description: "Rol silme korumasından muaf tutulur.", emoji: { id: "917448428932464700" }, value: "ROLE_DELETE", default: perms?.filter((x) => x.type == "guard")?.some((x) => x?.id === "ROLE_DELETE") ? true : false },
                    { label: "Rol Koruma (Düzenleme)", description: "Rol düzenleme korumasından muaf tutulur.", emoji: { id: "917448428932464700" }, value: "ROLE_UPDATE", default: perms?.filter((x) => x.type == "guard")?.some((x) => x?.id === "ROLE_UPDATE") ? true : false },
                    { label: "Üye Koruma (Ban)", description: "Sağ tık ban korumasından muaf tutulur.", emoji: { id: "1188150398238867541" }, value: "MEMBER_BAN", default: perms?.filter((x) => x.type == "guard")?.some((x) => x?.id === "MEMBER_BAN") ? true : false },
                    { label: "Üye Koruma (Kick)", description: "Sağ tık kick korumasından muaf tutulur.", emoji: { id: "1287526857012678747" }, value: "MEMBER_KICK", default: perms?.filter((x) => x.type == "guard")?.some((x) => x?.id === "MEMBER_KICK") ? true : false },
                    { label: "Emoji Koruma", description: "Emoji oluşturma ve silme korumasından muaf tutulur.", emoji: { id: "1287523367041368084" }, value: "EMOTE_GUARD", default: perms?.filter((x) => x.type == "guard")?.some((x) => x?.id === "EMOTE_GUARD") ? true : false },
                    { label: "Sunucu Koruma", description: "Sunucu ayarları düzenleme korumasından muaf tutulur.", emoji: { id: "1286743761174659225" }, value: "SERVER_PROTECT", default: perms?.filter((x) => x.type == "guard")?.some((x) => x?.id === "SERVER_PROTECT") ? true : false },
                    { label: "Mesaj Koruması", description: "Mesaj korumasından (reklam, spam vs.) muaf tutulur.", emoji: { id: "1286742966479618103" }, value: "MESSAGE_PROTECT", default: perms?.filter((x) => x.type == "guard")?.some((x) => x?.id === "MESSAGE_PROTECT") ? true : false },
                ],
                minValues: 0,
                maxValues: 12,
                placeholder: "Guard üzerindeki yetkileri değiştirmek için tıklayın.",
                customId: "perms_guard"
            })

            interaction
                .reply({ embeds: [embed], components: [new ActionRowBuilder({ components: [perms_guard] })] })
                .then(async () => {
                    let msg = await interaction
                        ?.fetchReply()
                        .catch(() => { })

                    if (msg) {
                        const collector = msg
                            .createMessageComponentCollector({ filter: ({ user }) => user.id === interaction.user.id, time: Number(1000 * 60 * 5) });

                        collector.on("collect", async (interaction) => {
                            if (interaction.customId == "perms_guard") {
                                if (interaction.values.includes("FULL")) {
                                    let checkUserFind = await permissionsModel.findOne({ guildID: interaction.guild.id, userID: user.user.id })
                                    let checkUserData = checkUserFind ? checkUserFind?.permissions?.map((x) => x) || [] : []
                                    let checkPerms = checkUserData
                                        ?.filter((x) => x.type == "guard")
                                        ?.map((x) => x)

                                    if (checkPerms.some((x) => x?.id == "FULL")) {
                                        let error = new EmbedBuilder()
                                            .setTitle(`${emotes.başarısız} Başarısız!`)
                                            .setDescription(`> Kullanıcıya zaten guard üzerinden **tam yetki** verilmiş. İşlem yapmak için kullanıcıdan **tam yetkiyi** kaldırmanız gerekiyor.`)
                                            .setColor("Red")

                                        let components = interaction.message.components[0].components
                                        components[0]?.data?.options.map((x) => {
                                            if (checkPerms.some((data) => data?.id == x?.value)) {
                                                x.default = true
                                            } else {
                                                x.default = false
                                            }
                                        })

                                        await interaction.message
                                            ?.edit({ components: interaction.message.components })
                                            .catch(() => { })

                                        await interaction
                                            .reply({ embeds: [error], flags: 64 })
                                            .catch(() => { })

                                        return;
                                    }
                                }

                                let checkUserFind = await permissionsModel.findOne({ guildID: interaction.guild.id, userID: user.user.id })
                                let checkUserData = checkUserFind ? checkUserFind?.permissions?.map((x) => x) || [] : []
                                let checkPerms = checkUserData
                                    ?.filter((x) => x.type == "guard")
                                    ?.map((x) => x)

                                let oldPerms = [];
                                let newPerms = [];
                                checkPerms
                                    .filter((x) => !interaction.values.includes(x?.id))
                                    .map((x) => oldPerms.push(x));

                                interaction.values
                                    .filter((x) => !checkPerms.find((data) => data?.id == x))
                                    .map((x) => newPerms.push(x));

                                if (oldPerms?.length > 0 && newPerms == 0) {
                                    let updatedPerms = [];

                                    checkPerms
                                        ?.filter((x) => !oldPerms.some((data) => data?.id == x?.id))
                                        .map((x) => updatedPerms
                                            .push(x))

                                    checkUserData
                                        ?.filter((x) => x.type == "system")
                                        ?.map((x) => updatedPerms
                                            .push(x))

                                    await permissionsModel
                                        .updateOne({ guildID: interaction.guild.id, userID: user.user.id }, { $set: { permissions: updatedPerms } }, { upsert: true })
                                        .catch(() => { })
                                }

                                if (newPerms?.length > 0) {
                                    let updatedPerms = []

                                    checkPerms
                                        ?.filter((x) => !oldPerms.some((data) => data?.id == x?.id))
                                        .map((x) => updatedPerms
                                            .push(x))
                                    newPerms
                                        .map((x) => updatedPerms
                                            .push({ type: "guard", id: x, staffID: interaction.user.id, time: Date.now() }))

                                    checkUserData
                                        ?.filter((x) => x.type == "system")
                                        ?.map((x) => updatedPerms
                                            .push(x))

                                    await permissionsModel
                                        .updateOne({ guildID: interaction.guild.id, userID: user.user.id }, { $set: { permissions: updatedPerms } }, { upsert: true })
                                        .catch(() => { })
                                }

                                let userFind = await permissionsModel.findOne({ guildID: interaction.guild.id, userID: user.user.id })
                                let userData = userFind ? userFind?.permissions?.map((x) => x) || [] : []
                                let perms = []

                                userData
                                    ?.filter((x) => x?.type == "guard")
                                    .map((x) => perms
                                        .push({ type: x?.type, id: x?.id }))

                                let embed = interaction.message.embeds[0]?.data
                                embed.fields[0] = ({
                                    name: "(Guard) Güncel Yetkiler ↷",
                                    value: `\`\`\`diff\n${perms
                                        .filter((x) => x.type == "guard")
                                        .map((x) => x)
                                        .length > 0 ? perms
                                            .filter((x) => x.type == "guard")
                                            .map((x) => `+ ${x?.id}`)
                                            .join("\n") : "- NO_PERMISSION"}\`\`\``,
                                    inline: true
                                })

                                let components = interaction.message.components[0].components
                                components[0]?.data?.options.map((x) => {
                                    if (perms.some((data) => data?.id == x?.value)) {
                                        x.default = true
                                    } else {
                                        x.default = false
                                    }
                                })

                                await interaction
                                    ?.update({ embeds: interaction.message.embeds, components: interaction.message.components })
                                    .catch(() => { })
                            }
                        })

                        collector.on("end", async () => {
                            await interaction
                                ?.deleteReply()
                                .catch(() => { })
                        })

                    } else {
                        setTimeout(async () => {
                            let errorEmbed = new EmbedBuilder()
                                .setTitle(`${emotes.uyarı} Hata!`)
                                .setDescription(`> Sistemsel bir sorun meydana geldi. Bu durumu lütfen [geliştiricime](https://discord.com/users/342557531178139648) bildirin.`)
                                .addFields([{ name: "ERROR Code ↷", value: "```diff\n- MESSAGE_NOT_FOUND```" }])
                                .setColor("Red")

                            let button1 = new ButtonBuilder({ style: ButtonStyle.Danger, emoji: { id: "928282667273826355" }, customId: "delete_message" })
                            let button2 = new ButtonBuilder({ style: ButtonStyle.Link, label: "Sorunu bildirmek için", url: genel_config.inviteURL })

                            await interaction
                                ?.editReply({ embeds: [errorEmbed], components: [new ActionRowBuilder({ components: [button1, button2] })], flags: 64 })
                                .catch(() => { })
                        }, 2000)
                    }
                })
                .catch(async (error) => {
                    let errorEmbed = new EmbedBuilder()
                        .setTitle(`${emotes.uyarı} Hata!`)
                        .setDescription(`> Sistemsel bir sorun meydana geldi. Bu durumu lütfen [geliştiricime](https://discord.com/users/342557531178139648) bildirin.`)
                        .addFields([{ name: "ERROR Code ↷", value: `\`\`\`diff\n- ${error?.code} - ${error?.message}\`\`\`` }])
                        .setColor("Red")

                    let button1 = new ButtonBuilder({ style: ButtonStyle.Danger, emoji: { id: "928282667273826355" }, customId: "delete_message" })
                    let button2 = new ButtonBuilder({ style: ButtonStyle.Link, label: "Sorunu bildirmek için", url: genel_config.inviteURL })

                    await interaction
                        ?.reply({ embeds: [errorEmbed], components: [new ActionRowBuilder({ components: [button1, button2] })], flags: 64 })
                        .catch(() => { })
                })
        }

        if (subcom == "rol-ver") {
            let role = interaction.options.getRole("role")
            if (!role) {
                let error = new EmbedBuilder()
                    .setTitle(`${emotes.başarısız} Başarısız!`)
                    .setDescription(`> Belirtilen rol sunucuda bulunmuyor yada geçersiz bir ID.`)
                    .setColor("Red")

                await interaction
                    .reply({ embeds: [error], flags: 64 })
                    .catch(() => { })

                return;
            }

            let roleFind = await permissionsModel.findOne({ guildID: interaction.guild.id, roleID: role.id })
            let roleData = roleFind ? roleFind?.permissions?.map((x) => x) || [] : []
            let perms = []

            roleData
                .map((x) => perms
                    .push({ type: x?.type, roleID: x?.roleID, id: x?.id }))

            let embed = new EmbedBuilder()
                .setTitle(`${emotes.safe} İzin Paneli`)
                .setDescription(`> ${role} rolünde güncel olarak **${perms?.filter((x) => x?.type == "guard").length} guard** yetkisi bulunuyor.`)
                .addFields([
                    {
                        name: "(Guard) Güncel Yetkiler ↷",
                        value: `\`\`\`diff\n${perms
                            .filter((x) => x.type == "guard")
                            .map((x) => x)
                            .length > 0 ? perms
                                .filter((x) => x.type == "guard")
                                .map((x) => `+ ${x?.id}`)
                                .join("\n") : "- NO_PERMISSION"}\`\`\``,
                        inline: true
                    },
                ])
                .setColor("Blue")

            let perms_guard = new StringSelectMenuBuilder({
                options: [
                    { label: "Tam yetki", description: "Tüm sistemlerde beyaz listeye alınır.", emoji: { id: "923848369854619658" }, value: "FULL", default: perms?.filter((x) => x.type == "guard")?.some((x) => x?.id === "FULL") ? true : false },
                    { label: "Kanal Koruma (Oluşturma)", description: "Kanal oluşturma korumasından muaf tutulur.", emoji: { id: "1185605494090518611" }, value: "CHANNEL_CREATE", default: perms?.filter((x) => x.type == "guard")?.some((x) => x?.id === "CHANNEL_CREATE") ? true : false },
                    { label: "Kanal Koruma (Silme)", description: "Kanal silme korumasından muaf tutulur.", emoji: { id: "1185605494090518611" }, value: "CHANNEL_DELETE", default: perms?.filter((x) => x.type == "guard")?.some((x) => x?.id === "CHANNEL_DELETE") ? true : false },
                    { label: "Kanal Koruma (Düzenleme)", description: "Kanal düzenleme korumasından muaf tutulur.", emoji: { id: "1185605494090518611" }, value: "CHANNEL_UPDATE", default: perms?.filter((x) => x.type == "guard")?.some((x) => x?.id === "CHANNEL_UPDATE") ? true : false },
                    { label: "Rol Koruma (Oluşturma)", description: "Rol oluşturma korumasından muaf tutulur.", emoji: { id: "917448428932464700" }, value: "ROLE_CREATE", default: perms?.filter((x) => x.type == "guard")?.some((x) => x?.id === "ROLE_CREATE") ? true : false },
                    { label: "Rol Koruma (Silme)", description: "Rol silme korumasından muaf tutulur.", emoji: { id: "917448428932464700" }, value: "ROLE_DELETE", default: perms?.filter((x) => x.type == "guard")?.some((x) => x?.id === "ROLE_DELETE") ? true : false },
                    { label: "Rol Koruma (Düzenleme)", description: "Rol düzenleme korumasından muaf tutulur.", emoji: { id: "917448428932464700" }, value: "ROLE_UPDATE", default: perms?.filter((x) => x.type == "guard")?.some((x) => x?.id === "ROLE_UPDATE") ? true : false },
                    { label: "Üye Koruma (Ban)", description: "Sağ tık ban korumasından muaf tutulur.", emoji: { id: "1188150398238867541" }, value: "MEMBER_BAN", default: perms?.filter((x) => x.type == "guard")?.some((x) => x?.id === "MEMBER_BAN") ? true : false },
                    { label: "Üye Koruma (Kick)", description: "Sağ tık kick korumasından muaf tutulur.", emoji: { id: "1287526857012678747" }, value: "MEMBER_KICK", default: perms?.filter((x) => x.type == "guard")?.some((x) => x?.id === "MEMBER_KICK") ? true : false },
                    { label: "Emoji Koruma", description: "Emoji oluşturma ve silme korumasından muaf tutulur.", emoji: { id: "1287523367041368084" }, value: "EMOTE_GUARD", default: perms?.filter((x) => x.type == "guard")?.some((x) => x?.id === "EMOTE_GUARD") ? true : false },
                    { label: "Sunucu Koruma", description: "Sunucu ayarları düzenleme korumasından muaf tutulur.", emoji: { id: "1286743761174659225" }, value: "SERVER_PROTECT", default: perms?.filter((x) => x.type == "guard")?.some((x) => x?.id === "SERVER_PROTECT") ? true : false },
                    { label: "Mesaj Koruması", description: "Mesaj korumasından (reklam, spam vs.) muaf tutulur.", emoji: { id: "1286742966479618103" }, value: "MESSAGE_PROTECT", default: perms?.filter((x) => x.type == "guard")?.some((x) => x?.id === "MESSAGE_PROTECT") ? true : false },
                ],
                minValues: 0,
                maxValues: 12,
                placeholder: "Guard üzerindeki yetkileri değiştirmek için tıklayın.",
                customId: "perms_guard"
            })

            interaction
                .reply({ embeds: [embed], components: [new ActionRowBuilder({ components: [perms_guard] })] })
                .then(async () => {
                    let msg = await interaction
                        ?.fetchReply()
                        .catch(() => { })

                    if (msg) {
                        const collector = msg
                            .createMessageComponentCollector({ filter: ({ user }) => user.id === interaction.user.id, time: Number(1000 * 60 * 5) });

                        collector.on("collect", async (interaction) => {
                            if (interaction.customId == "perms_guard") {
                                if (interaction.values.includes("FULL")) {
                                    let checkRoleFind = await permissionsModel.findOne({ guildID: interaction.guild.id, roleID: role.id })
                                    let checkRoleData = checkRoleFind ? checkRoleFind?.permissions?.map((x) => x) || [] : []
                                    let checkPerms = checkRoleData
                                        ?.filter((x) => x.type == "guard")
                                        ?.map((x) => x)

                                    if (checkPerms.some((x) => x?.id == "FULL")) {
                                        let error = new EmbedBuilder()
                                            .setTitle(`${emotes.başarısız} Başarısız!`)
                                            .setDescription(`> Role zaten guard üzerinden **tam yetki** verilmiş. İşlem yapmak için kullanıcıdan **tam yetkiyi** kaldırmanız gerekiyor.`)
                                            .setColor("Red")

                                        let components = interaction.message.components[0].components
                                        components[0]?.data?.options.map((x) => {
                                            if (checkPerms.some((data) => data?.id == x?.value)) {
                                                x.default = true
                                            } else {
                                                x.default = false
                                            }
                                        })

                                        await interaction.message
                                            ?.edit({ components: interaction.message.components })
                                            .catch(() => { })

                                        await interaction
                                            .reply({ embeds: [error], flags: 64 })
                                            .catch(() => { })

                                        return;
                                    }
                                }

                                let checkRoleFind = await permissionsModel.findOne({ guildID: interaction.guild.id, roleID: role.id })
                                let checkRoleData = checkRoleFind ? checkRoleFind?.permissions?.map((x) => x) || [] : []
                                let checkPerms = checkRoleData
                                    ?.filter((x) => x.type == "guard")
                                    ?.map((x) => x)

                                let oldPerms = [];
                                let newPerms = [];
                                checkPerms
                                    .filter((x) => !interaction.values.includes(x?.id))
                                    .map((x) => oldPerms.push(x));

                                interaction.values
                                    .filter((x) => !checkPerms.find((data) => data?.id == x))
                                    .map((x) => newPerms.push(x));

                                if (oldPerms?.length > 0 && newPerms == 0) {
                                    let updatedPerms = [];

                                    checkPerms
                                        ?.filter((x) => !oldPerms.some((data) => data?.id == x?.id))
                                        .map((x) => updatedPerms
                                            .push(x))

                                    checkRoleData
                                        ?.filter((x) => x.type == "system")
                                        ?.map((x) => updatedPerms
                                            .push(x))

                                    await permissionsModel
                                        .updateOne({ guildID: interaction.guild.id, roleID: role.id }, { $set: { permissions: updatedPerms } }, { upsert: true })
                                        .catch(() => { })
                                }

                                if (newPerms?.length > 0) {
                                    let updatedPerms = []

                                    checkPerms
                                        ?.filter((x) => !oldPerms.some((data) => data?.id == x?.id))
                                        .map((x) => updatedPerms
                                            .push(x))
                                    newPerms
                                        .map((x) => updatedPerms
                                            .push({ type: "guard", roleID: role.id, id: x, staffID: interaction.user.id, time: Date.now() }))

                                    checkRoleData
                                        ?.filter((x) => x.type == "system")
                                        ?.map((x) => updatedPerms
                                            .push(x))

                                    await permissionsModel
                                        .updateOne({ guildID: interaction.guild.id, roleID: role.id }, { $set: { permissions: updatedPerms } }, { upsert: true })
                                        .catch(() => { })
                                }

                                let roleFind = await permissionsModel.findOne({ guildID: interaction.guild.id, roleID: role.id })
                                let roleData = roleFind ? roleFind?.permissions?.map((x) => x) || [] : []
                                let perms = []

                                roleData
                                    ?.filter((x) => x?.type == "guard")
                                    .map((x) => perms
                                        .push({ type: x?.type, id: x?.id }))

                                let embed = interaction.message.embeds[0]?.data
                                embed.fields[0] = ({
                                    name: "(Guard) Güncel Yetkiler ↷",
                                    value: `\`\`\`diff\n${perms
                                        .filter((x) => x.type == "guard")
                                        .map((x) => x)
                                        .length > 0 ? perms
                                            .filter((x) => x.type == "guard")
                                            .map((x) => `+ ${x?.id}`)
                                            .join("\n") : "- NO_PERMISSION"}\`\`\``,
                                    inline: true
                                })

                                let components = interaction.message.components[0].components
                                components[0]?.data?.options.map((x) => {
                                    if (perms.some((data) => data?.id == x?.value)) {
                                        x.default = true
                                    } else {
                                        x.default = false
                                    }
                                })

                                await interaction
                                    ?.update({ embeds: interaction.message.embeds, components: interaction.message.components })
                                    .catch(() => { })
                            }
                        })

                        collector.on("end", async () => {
                            await interaction
                                ?.deleteReply()
                                .catch(() => { })
                        })

                    } else {
                        setTimeout(async () => {
                            let errorEmbed = new EmbedBuilder()
                                .setTitle(`${emotes.uyarı} Hata!`)
                                .setDescription(`> Sistemsel bir sorun meydana geldi. Bu durumu lütfen [geliştiricime](https://discord.com/users/342557531178139648) bildirin.`)
                                .addFields([{ name: "ERROR Code ↷", value: "```diff\n- MESSAGE_NOT_FOUND```" }])
                                .setColor("Red")

                            let button1 = new ButtonBuilder({ style: ButtonStyle.Danger, emoji: { id: "928282667273826355" }, customId: "delete_message" })
                            let button2 = new ButtonBuilder({ style: ButtonStyle.Link, label: "Sorunu bildirmek için", url: genel_config.inviteURL })

                            await interaction
                                ?.editReply({ embeds: [errorEmbed], components: [new ActionRowBuilder({ components: [button1, button2] })], flags: 64 })
                                .catch(() => { })
                        }, 2000)
                    }
                })
                .catch(async (error) => {
                    let errorEmbed = new EmbedBuilder()
                        .setTitle(`${emotes.uyarı} Hata!`)
                        .setDescription(`> Sistemsel bir sorun meydana geldi. Bu durumu lütfen [geliştiricime](https://discord.com/users/342557531178139648) bildirin.`)
                        .addFields([{ name: "ERROR Code ↷", value: `\`\`\`diff\n- ${error?.code} - ${error?.message}\`\`\`` }])
                        .setColor("Red")

                    let button1 = new ButtonBuilder({ style: ButtonStyle.Danger, emoji: { id: "928282667273826355" }, customId: "delete_message" })
                    let button2 = new ButtonBuilder({ style: ButtonStyle.Link, label: "Sorunu bildirmek için", url: genel_config.inviteURL })

                    await interaction
                        ?.reply({ embeds: [errorEmbed], components: [new ActionRowBuilder({ components: [button1, button2] })], flags: 64 })
                        .catch(() => { })
                })
        }

        if (subcom == "listele") {
            await interaction
                .deferReply({ flags: 64 })
                .catch(() => { });

            let backButton = new ButtonBuilder({ style: ButtonStyle.Primary, emoji: "928282903694163988", customId: "back" });
            let forwardButton = new ButtonBuilder({ style: ButtonStyle.Primary, emoji: "928282844491575296", customId: "forward" });
            let closeBackButton = new ButtonBuilder({ style: ButtonStyle.Primary, emoji: "928282903694163988", customId: "closeBack", disabled: true });
            let closeForwardButton = new ButtonBuilder({ style: ButtonStyle.Primary, emoji: "928282844491575296", customId: "closeForward", disabled: true });
            let deleteButton = new ButtonBuilder({ style: ButtonStyle.Danger, emoji: "928282667273826355", customId: "deleteButton" });

            let süsbutton1 = new ButtonBuilder({ style: ButtonStyle.Secondary, label: "ㅤㅤㅤ", customId: "süsbutton1", disabled: true })
            let süsbutton2 = new ButtonBuilder({ style: ButtonStyle.Secondary, label: "ㅤㅤㅤ", customId: "süsbutton2", disabled: true })

            let permissionsFind = await permissionsModel.find({ guildID: interaction.guild.id })
            let permissionData = []
            permissionsFind ? permissionsFind
                ?.filter((x) => x?.permissions ? x?.permissions?.length > 0 ? true : false : false)
                ?.map((x) => {
                    let type = x?.userID ? "user" : "role";
                    let id = x?.userID ? x?.userID : x?.roleID

                    permissionData
                        .push({ type: type, id: id, permissions: x?.permissions.map((x) => (x)) })
                }) || [] : []

            if (permissionData.length <= 0)
                return await interaction
                    .followUp({ content: `> ${emotes.başarısız} **Başarısız!** Sistemde sunucuya ait izin kaydı bulunmuyor.`, flags: 64 })
                    .catch(() => { });

            let records = permissionData
                ?.map((x) => x)
                .sort((a, b) => b.time - a.time)

            var how = 5;
            let page = 1;

            let type = "user";
            const generateEmbed = async start => {
                if (type == "user") {
                    const current = records
                        ?.filter((x) => x?.type == "user")
                        ?.slice(start, start + how)

                    let total = Math.ceil(records
                        ?.filter((x) => x?.type == "user")?.length / how)
                    let number = page === 1 ? 1 : page * how - how + 1;
                    let fields = [];

                    current
                        .map((x) => {
                            let member = interaction.guild.members.cache.get(x.id)

                            fields
                                .push({
                                    name: `[${number++}/${records?.filter((x) => x?.type == "user")?.length}] İzin Listesi ↷`,
                                    value: `**╰**  Kullanıcı: **[${member ? member.user.globalName || member.user.username : "?"} (${x?.id})](https://discord.com/users/${x?.id})**\n**╰**  Guard izinleri: **${x?.permissions
                                        .filter((x) => x.type == "guard")
                                        .map((x) => `${x.id}`)
                                        .join(", ") || "Guard izni bulunmuyor."}**`,
                                    inline: false
                                })
                        })

                    let embed = new EmbedBuilder()
                        .setTitle(`${emotes.mavikelebek} Yetki Listesi`)
                        .setDescription(`> Belirtilen kullanıcılara verilmiş toplam **${records
                            ?.filter((x) => x?.type == "user").length} yetki izin** bulunuyor.`)
                        .addFields(fields)
                        .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
                        .setFooter({ text: `Sayfa ${page} / ${total}` })
                        .setColor("Blue")

                    let perms_guard = new StringSelectMenuBuilder({
                        options: [
                            { label: "Kullanıcıları Listele", description: "İzin verilmiş kullanıcıları listeler.", emoji: { id: "658538493470965787" }, value: "user", default: true },
                            { label: "Rolleri Listele", description: "İzin verilmiş rolleri listeler.", emoji: { id: "917448428932464700" }, value: "role", default: false },
                        ],
                        minValues: 1,
                        maxValues: 1,
                        placeholder: "Bilgisini almak istediğiniz türü seçin.",
                        customId: "permissions_data"
                    })

                    return { embed: embed, components: new ActionRowBuilder({ components: [perms_guard] }) };
                } else if (type == "role") {
                    const current = records
                        ?.filter((x) => x?.type == "role")
                        ?.slice(start, start + how)

                    let total = Math.ceil(records
                        ?.filter((x) => x?.type == "role")?.length / how)
                    let number = page === 1 ? 1 : page * how - how + 1;
                    let fields = [];

                    current
                        .map((x) => {
                            let role = interaction.guild.roles.cache.get(x.id)

                            fields
                                .push({
                                    name: `[${number++}/${records?.filter((x) => x?.type == "role")?.length}] İzin Listesi ↷`,
                                    value: `**╰**  Kullanıcı: ${role ? role : "?"} **[(${x?.id})](https://discord.com/users/${x?.id})**\n**╰**  Guard izinleri: **${x?.permissions
                                        .filter((x) => x.type == "guard")
                                        .map((x) => `${x.id}`)
                                        .join(", ") || "Guard izni bulunmuyor."}**`,
                                    inline: false
                                })
                        })

                    let embed = new EmbedBuilder()
                        .setTitle(`${emotes.mavikelebek} Yetki Listesi`)
                        .setDescription(`> Belirtilen rollere verilmiş toplam **${records
                            ?.filter((x) => x?.type == "role").length} yetki izin** bulunuyor.`)
                        .addFields(fields)
                        .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
                        .setFooter({ text: `Sayfa ${page} / ${total}` })
                        .setColor(Colors.Blue)

                    let perms_guard = new StringSelectMenuBuilder({
                        options: [
                            { label: "Kullanıcıları Listele", description: "İzin verilmiş kullanıcıları listeler.", emoji: { id: "658538493470965787" }, value: "user", default: false },
                            { label: "Rolleri Listele", description: "İzin verilmiş rolleri listeler.", emoji: { id: "917448428932464700" }, value: "role", default: true },
                        ],
                        minValues: 1,
                        maxValues: 1,
                        placeholder: "Bilgisini almak istediğiniz türü seçin.",
                        customId: "permissions_data"
                    })

                    return { embed: embed, components: new ActionRowBuilder({ components: [perms_guard] }) };
                }
            };

            const canFitOnOnePage = records
                ?.filter((x) => x?.type == "user")
                .length <= how;
            await interaction
                .followUp({ embeds: [(await generateEmbed(0)).embed], components: canFitOnOnePage ? [(await generateEmbed(0)).components, new ActionRowBuilder({ components: [süsbutton1, closeBackButton, deleteButton, closeForwardButton, süsbutton2] })] : [(await generateEmbed(0)).components, new ActionRowBuilder({ components: [süsbutton1, closeBackButton, deleteButton, forwardButton, süsbutton2] })] })
                .then(async () => {
                    let msg = await interaction
                        .fetchReply()
                        .catch(() => { })

                    const collector = msg
                        .createMessageComponentCollector({ filter: ({ user }) => user.id === interaction.user.id, time: 600000 });

                    let currentIndex = 0;
                    collector.on("collect", async interaction => {
                        if (interaction.isStringSelectMenu()) {
                            if (interaction.values[0] == "user") {
                                page = 1;
                                type = "user";
                                currentIndex = 0;

                                await interaction
                                    .update({
                                        embeds: [(await generateEmbed(currentIndex)).embed],
                                        components: [(await generateEmbed(currentIndex)).components, new ActionRowBuilder({
                                            components: [süsbutton1, ...(currentIndex ? [backButton] : [closeBackButton]), deleteButton, ...(currentIndex + how < records
                                                ?.filter((x) => x?.type == type)
                                                .length ? [forwardButton] : [closeForwardButton]), süsbutton2]
                                        })]
                                    })
                                    .catch(() => { });
                            }

                            if (interaction.values[0] == "role") {
                                page = 1;
                                type = "role";
                                currentIndex = 0;

                                await interaction
                                    .update({
                                        embeds: [(await generateEmbed(currentIndex)).embed],
                                        components: [(await generateEmbed(currentIndex)).components, new ActionRowBuilder({
                                            components: [süsbutton1, ...(currentIndex ? [backButton] : [closeBackButton]), deleteButton, ...(currentIndex + how < records
                                                ?.filter((x) => x?.type == type)
                                                .length ? [forwardButton] : [closeForwardButton]), süsbutton2]
                                        })]
                                    })
                                    .catch(() => { });
                            }
                        }

                        if (interaction.isButton()) {
                            if (interaction.customId == "deleteButton") {
                                interaction
                                    ?.update({ content: `Bu mesajı sadece sen görebiliyorsun bu yüzden mesajı silemem. Silmek için **Bu mesajı sil** yazısına tıklayabilirsin.`, embeds: [], components: [] })
                                    .catch(() => { })
                            }

                            if (interaction.customId !== "deleteButton") {
                                if (interaction.customId === "back") page--;
                                if (interaction.customId === "forward") page++;

                                interaction.customId === "back"
                                    ? (currentIndex -= how)
                                    : (currentIndex += how);

                                await interaction
                                    .update({
                                        embeds: [(await generateEmbed(currentIndex)).embed],
                                        components: [(await generateEmbed(currentIndex)).components, new ActionRowBuilder({
                                            components: [süsbutton1, ...(currentIndex ? [backButton] : [closeBackButton]), deleteButton, ...(currentIndex + how < records
                                                ?.filter((x) => x?.type == type)
                                                .length ? [forwardButton] : [closeForwardButton]), süsbutton2]
                                        })]
                                    })
                                    .catch(() => { });
                            }
                        }
                    });
                })
                .catch(() => { });
        }
    }
};