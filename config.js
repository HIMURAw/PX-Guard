module.exports = {
    genel_config: {
        description: `\`📌\` **Discord:** https://discord.gg/pxguard
                      \`🔗\` **Site:** \`https://pixeldev.com.tr>\` 
    `,
        inviteURL: "https://discord.gg/pxdev"
    },
    discord: {
        token: "MTI1NjI2MTA0NTU3NjUzNjA4NQ.GfYwz7.BE8CH3IbE_ho5prjQu83afC6ADE8hcdhMi7-TQ",
        guards_token: ["MTMxNzkyNTAwOTI4NDY2MTQxMQ.GrzV-A.iJGfeUAZhfnTb3LEDx2DLg-qtdwfe5SYxnFoSA", "MTI1NzQzODA0NzU0MTEzNzQ2OQ.GTSlA3.s6OT8KFepWWnWRiOwL24cB8MNTiuwYsQeQC0SM"],
        serverId: "1399434662706679958",
        voiceID: "1399434663373705310"
    },
    guard_config: {
        punishmentsType: {
            type: "ban", // Güvenlik ihlali yapan kullanıcıya uygulanacak ceza türü. Seçenekler:
            // "ban"  => Kullanıcıyı sunucudan tamamen yasaklar.
            // "kick" => Kullanıcıyı sunucudan atar ama tekrar girebilir.
            // "jail" => Kullanıcıya belirli bir "cezalı" rolü verir, bu rolü roleId kısmında belirtmelisiniz.

            roleId: "",   // Eğer yukarıda type "jail" olarak ayarlandıysa, burada cezalı rolünün ID'si girilmeli.
            // Bu rol, kullanıcının diğer tüm yetkilerini engellemelidir.
        },

        logChannelWebHook: "https://discord.com/api/webhooks/1399445444303519866/PCyr6PSyrIZforQNAYmY8khdvbUxEtiuuEpiEl7yXuAjSQbFlgM6kXHdKkr6GVWVNN5D",
        // Botun algıladığı tüm güvenlik ihlallerini detaylı şekilde göndereceği Webhook bağlantısı.
        // Log mesajları bu webhook üzerinden belirli bir kanala embed olarak gider.

        dailyInfoLogChannelID: "1399434783360286871",
        // Botun günlük istatistik, durum veya özet bilgi mesajlarını göndereceği kanalın ID'si.
        // Örn: kaç saldırı engellendi, kaç kullanıcı cezalandırıldı gibi bilgiler burada paylaşılır.

        channel_limit: { create: 3, delete: 3, update: 3 },
        // Yetkili kullanıcıların kanal oluşturma, silme ve güncelleme işlemleri için limitler.
        // Örneğin: 3’ten fazla kanal silmeye çalışırsa otomatik olarak yetkileri alınabilir veya cezalandırılabilir.

        role_limit: { create: 3, delete: 3, update: 3 },
        // Yetkili kullanıcıların rol oluşturma, silme ve güncelleme işlemleri için sınırlar.
        // Amaç: kötü niyetli bir yetkili çok sayıda rol değiştirirse bunu fark edip engellemek.

        emote_limit: { create: 3, delete: 3, update: 3 },
        // Sunucudaki emoji ve sticker işlemleri için sınır.
        // Örneğin: 3’ten fazla emoji silmeye çalışan biri otomatik olarak cezalandırılabilir.

        ban_limit: { limit: 3 },
        // Yetkililerin kısa sürede yapabileceği maksimum ban sayısı.
        // Örn: 3 kişiyi kısa sürede banlarsa bot bunu potansiyel tehdit olarak görür ve engeller.

        unban_limit: { limit: 3 },
        // Kısa sürede yapılabilecek maksimum “ban kaldırma” işlemi.
        // Toplu unban gibi tehlikeli işlemleri tespit edip önlemek için kullanılır.

        kick_limit: { limit: 3 },
        // Yetkili birinin kısa sürede kaç kullanıcıyı atabileceğini sınırlayan değer.
        // 3’ten fazla kick yaparsa bu kötüye kullanım olabilir.

        server_limit: { limit: 3 },
        // Sunucuyla ilgili büyük değişikliklerde (örneğin sunucu adı, icon değişikliği gibi) tetiklenen limit.
        // Sunucu ayarlarının kötü niyetli kişilerce değiştirilmesini engell
    },
    logs: {

    },
    emotes: {
        başarılı: "<a:basarili:1374082639434350673>",
        başarısız: "<a:basarisiz:1374082641929834658>",
        uyarı: "<a:uyari:1374082651367014560>",
        yükleniyor: "<a:yukleniyor:1374082653497852104>",
        tosun: "<a:tosun:1374082648737316994>",
        safe: "<a:safe:1374082647227236552>",
        mavikelebek: "<a:mavikelebek:1374082644094091525>",
        db: "<:mongodb:1374082645818085598>",
        ban: "<:ban:1374082637572079766>",
        fivem: "<a:mavikelebek:1374082644094091525>"
    },

    bots_config: {
        guard_system: {
            mongoURL: "mongodb://127.0.0.1:27017/FivemDB",
            playings: ["PXDev 🎮"],

            prefixs: ["!"],
            ownersId: ["768372430631731210"],
            developersID: ["768372430631731210"],
        },
    }
}