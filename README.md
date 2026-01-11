<div align="center">
  <h1>🛡️ PX-Guard | Gelişmiş Sunucu Koruma ve Log Botu</h1>

  [![Discord](https://img.shields.io/discord/1269430268402335867?color=7289DA&label=Destek&logo=discord&logoColor=white)](https://discord.gg/pxdev)
  [![Node.js](https://img.shields.io/badge/Node.js-v16+-green?logo=node.js&logoColor=white)](https://nodejs.org/)
  [![Discord.js](https://img.shields.io/badge/Discord.js-v14-blue?logo=discord&logoColor=white)](https://discord.js.org/)
  [![License](https://img.shields.io/badge/Lisans-MIT-yellow.svg)](LICENSE)

  <p>
    <strong>PX-Guard</strong>, Discord sunucunuzu kötü niyetli saldırılara, izinsiz işlemlere ve yetki suistimallerine karşı koruyan profesyonel bir güvenlik botudur.
    Çoklu bot yapısı (Main + Guardlar) ile sunucunuzu saniyeler içinde koruma altına alır.
  </p>

</div>

---

## 📑 İçindekiler
- [🔥 Özellikler](#-özellikler)
    - [Koruma Sistemi (Guard)](#-koruma-sistemi-guard)
    - [Log Sistemi](#-log-sistemi)
- [🚀 Kurulum](#-kurulum)
- [⚙️ Yapılandırma](#️-yapılandırma)
- [🔧 Komutlar](#-komutlar)
- [❓ Sık Karşılaşılan Sorunlar](#-sık-karşılaşılan-sorunlar)

---

## 🔥 Özellikler

### 🛡️ Koruma Sistemi (Guard)
Yetkili rollerin yapabileceği işlemleri sınırlar ve limit aşımında otomatik işlem yapar (Ban/Kick/Jail). `config.js` üzerinden limitler ayarlanabilir.

- **Kanal Koruması:** Kanal silme/oluşturma/düzenleme limitleri.
- **Rol Koruması:** Rol silme/oluşturma/düzenleme/yetki verme limitleri.
- **Emoji/Sticker Koruması:** Emoji silme işlemlerini denetler.
- **Ban/Kick Koruması:** Sağ tık ban/kick işlemlerini sınırlar (Toplu ban saldırılarını engeller).
- **Sunucu Koruması:** Sunucu adı, resmi veya URL'sinin değiştirilmesini engeller.
- **Spam Koruması:** Belirli sürede aşırı mesaj atan kullanıcıları susturur.
- **Küfür Koruması:** Gelişmiş küfür filtresi (bypass edilebilir listeli).

### 📜 Log Sistemi
Sunucuda olup biten her şeyi detaylıca kayıt altına alır. **Main Bot** bu işlemleri üstlenir.

- ✅ **Rol Log:** Rol oluşturma, silme ve güncelleme (Eski/Yeni isim, Renk, ID).
- 💬 **Mesaj Log:** Silinen ve düzenlenen mesajlar (Eski/Yeni içerik, Yazar, Kanal). *Hafızada olmayan eski mesajları bile "Bilinmeyen İçerik" olarak raporlar.*
- 🎤 **Ses Log:** Sese giriş, çıkış, mute/unmute, deafen/undeafen işlemleri.
- 📂 **Kanal Log:** Kanal oluşturma, silme, isim/kategori/izin değişiklikleri.
- 🔨 **Ban/Kick Log:** Yasaklama ve atılma işlemleri.
- 👋 **Giriş/Çıkış Log:** Sunucuya gelen ve giden üyeler.

---

## 🚀 Kurulum

1. **Projeyi İndirin:**
   ```bash
   git clone https://github.com/HIMURAw/PX-Guard.git
   cd PX-Guard
   ```

2. **Gerekli Modülleri Yükleyin:**
   ```bash
   npm install
   ```

3. **Yapılandırmayı Düzenleyin:**
   `config.js` dosyasını açın ve token/sunucu bilgilerinizi girin.

4. **Botu Başlatın:**
   ```bash
   node index.js
   ```

---

## ⚙️ Yapılandırma (`config.js`)

Tüm ayarlar `config.js` dosyasında bulunur.

| Ayar | Açıklama |
| :--- | :--- |
| `discord.token` | Ana (Main) botun tokeni. (Loglama ve genel işler) |
| `discord.guards_token` | Guard botlarının token listesi. (Sadece koruma yapar) |
| `guard_config.limit` | Kanal, rol vb. işlemler için izin verilen maksimum sayı (örn: 3). |
| `guard_config.punishmentsType` | Limit aşımında verilecek ceza (`ban`, `kick`, `jail`). |
| `bots_logs` | Log kanallarının ID'leri. |

---

## 🔧 Komutlar

Botun slash (/) komutları mevcuttur.

- **/setup** - Log kanallarını otomatik kurar veya yapılandırır.
- **/backup** - Sunucu yedeği alır veya yedeği geri yükler.
- **/whitelist** - Güvenli kullanıcıları (işlem kısıtlamasına takılmayacak kişileri) yönetir. (Ekle/Sil/Liste)
- **/safeyt** - Güvenli rolleri yönetir.

---

## ❓ Sık Karşılaşılan Sorunlar

### "Loglar 2 kere (veya 4 kere) gönderiliyor!"
Bu sorun genellikle aynı botun arka planda birden fazla kez çalışmasından kaynaklanır.
**Çözüm:** Terminali temizleyin veya `taskkill /F /IM node.exe` komutuyla tüm Node işlemlerini kapatıp tekrar başlatın.

### "Bot log atmıyor / Hata vermiyor"
Log kanal ID'lerinin `config.js` dosyasında doğru girildiğinden ve botun o kanalı görme yetkisi olduğundan emin olun.

### "uncached message" uyarısı nedir?
Bot yeniden başlatılmadan önce atılmış çok eski mesajlar silinirse bot içeriği bilemez. PX-Guard bu durumda hata vermek yerine "Bilinmeyen İçerik" olarak log atar, sistem çökmez.

---

<div align="center">
  <strong>Geliştirici: HIMURAw</strong> <br>
  Made with ❤️ by PX Developers
</div>
