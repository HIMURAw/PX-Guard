module.exports = {
    server_config: {
        permissions: ["704100895809470524", "768372430631731210"],
    },
    genel_config: {
        description: `\`📌\` **Discord:** https://discord.gg/pxguard
                      \`🔗\` **Site:** \`https://pixeldev.com.tr>\` 
    `,
        inviteURL: "https://discord.gg/pxdev"
    },
    discord: {
        token: ".........................................................",
        guards_token: [".................................................", "........................................................."],
        serverId: "...................",
        voiceID: "................."
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

        logChannelWebHook: "https://discord.com/api/webhooks/...",
        // Botun algıladığı tüm güvenlik ihlallerini detaylı şekilde göndereceği Webhook bağlantısı.
        // Log mesajları bu webhook üzerinden belirli bir kanala embed olarak gider.

        dailyInfoLogChannelID: "...................",
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
        spamMessageSize: 7, // KULLANICI XX SANİYEDE XX MESAJ ATARSA SPAM ENGEL MESAJ SAYISI
        spamTime: 3000, // KULLANICI XX SANİYEDE XX MESAJ ATARSA SPAM ENGEL SÜRESİ ( 1000 ms => 1 saniye )

        shortBadwords: ["amk", "aq", "oç", "sik", "am"], //["amk", "aq", "oç", "sik", "am"],
        badwords: ["fuck", "bitch", "dick", "d1ck", "pussy", "b1tch", "b!tch", "blowjob", "orspu", "amk çocu", "skiyim", "sikim ", "orospu", "orospu çocuğu", "orspu çocu", "göt", "zenci", "avrad ", "avrat", "köpek", "oevladı", "o.evladı", "Sikiş", "sikis", "sikş", "yarrak", "skerim", "sīkerim", "síkerm", "síkerim", "sįkerim", "sįkerįm", "sīkerīm", "skerīm", "síkerím", "sík", "sįk ", "sīk", "sïk", "sîk", "amcık", "amcik", "aminakoyim", "amınakoyim", "amnakoyim", "aminakoyım"], //["fuck", "bitch", "dick", "d1ck", "pussy", "b1tch", "b!tch", "blowjob", "orspu", "amk çocu", "skiyim", "sikim ", "orospu", "orospu çocuğu", "orspu çocu", "göt", "zenci", "avrad ", "avrat", "köpek", "oevladı", "o.evladı", "Sikiş", "sikis", "sikş", "yarrak", "skerim", "sīkerim", "síkerm", "síkerim", "sįkerim", "sįkerįm", "sīkerīm", "skerīm", "síkerím", "sík", "sįk ", "sīk", "sïk", "sîk", "amcık", "amcik", "aminakoyim", "amınakoyim", "amnakoyim", "aminakoyım"],
    },
    logs: {

    },
    emotes: {
        başarılı: "✅",
        başarısız: "❌",
        uyarı: "⚠️",
        yükleniyor: "🔄",
        tosun: "🐷",
        safe: "🛡️",
        mavikelebek: "🦋",
        db: "💾",
        ban: "🔨",
        fivem: "🎮"
    },

    bots_config: {
        guard_system: {
            mongoURL: "mongodb://127.0.0.1:27017/pxguard",
            playings: ["PXDev 🎮"],

            prefixs: ["!"],
            ownersId: ["......................"],
            developersID: ["768372430631731210"],
        },
    },

    bots_logs: {
        channelLog: "ID",
        emojiLog: "ID",
        banLog: "ID",
        unbanLog: "ID",
        joinLog: "ID",
        leaveLog: "ID",
        messageLog: "ID",
        voiceLog: "ID",
        roleLog: "ID",
        dailyInfoLogChannelID: "ID",
    }
}