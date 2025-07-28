# PX-Guard Discord Protection Bot

A powerful Discord guard bot designed to protect your server from raids, unauthorized actions, and potential security threats.

## 🛡️ Features

- **Multi-Guard System**: Multiple guard bots working together for enhanced security
- **Anti-Raid Protection**: Prevents mass joins and suspicious activities
- **Permission Control**: Monitors and limits administrative actions
- **Voice Channel Protection**: Automatic voice channel monitoring
- **Logging System**: Detailed logging of all security events
- **Limit System**: Configurable limits for various actions:
  - Channel operations (create/delete/update)
  - Role operations (create/delete/update)
  - Emoji operations (create/delete/update)
  - Ban/Unban operations
  - Kick operations
  - Server setting changes

## ⚙️ Configuration

Create a `config.js` file with the following structure:

```javascript
module.exports = {
    genel_config: {
        description: "Your bot description",
        inviteURL: "Your Discord invite URL"
    },
    discord: {
        token: "YOUR_MAIN_BOT_TOKEN",
        guards_token: ["GUARD_BOT_TOKEN_1", "GUARD_BOT_TOKEN_2"],
        serverId: "YOUR_SERVER_ID",
        voiceID: "VOICE_CHANNEL_ID"
    }
    // ... other configurations
}
```

## 🚀 Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/PX-Guard.git
```

2. Install dependencies:
```bash
cd PX-Guard
npm install
```

3. Set up your configuration in `config.js`

4. Start the bot:
```bash
node index.js
```

## 📋 Requirements

- Node.js v16.x or higher
- MongoDB
- Discord.js v14.x

## 🔧 Command List

- `!antiraid` - Configure anti-raid settings
- `!limits` - View or modify security limits
- `!whitelist` - Manage trusted users
- `!logs` - View security logs
- (Additional commands documentation...)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

- Discord Server: [Join Here](https://discord.gg/pxguard)
- Website: [pixeldev.com.tr](https://pixeldev.com.tr)

## ⚠️ Disclaimer

This bot is for educational purposes only. Make sure to comply with Discord's Terms of Service and Developer Terms.