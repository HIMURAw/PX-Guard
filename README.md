<div align="center">
  <h1>🚨 PX-Guard | Discord Anti-Raid & Authorization Bot</h1>
  
  [![Discord](https://img.shields.io/discord/your-server-id?color=7289DA&label=Discord&logo=discord&logoColor=white)](https://discord.gg/pxdev)
  [![GitHub license](https://img.shields.io/github/license/HIMURAw/PX-Guard?color=blue)](LICENSE)
  [![GitHub stars](https://img.shields.io/github/stars/HIMURAw/PX-Guard?style=social)](https://github.com/HIMURAw/PX-Guard/stargazers)
  [![Discord.js](https://img.shields.io/badge/discord.js-v14-7289DA?logo=discord&logoColor=white)](https://discord.js.org/)
  
  **PX-Guard** is a powerful anti-raid and user authorization bot designed to protect your Discord server. It prevents unauthorized access attempts, detects suspicious activities, and provides authorization systems to make administrators' jobs easier.
  
  [![Deploy to Heroku](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/HIMURAw/PX-Guard)
  [![Invite to Server](https://img.shields.io/badge/Invite-PX--Guard-7289DA?style=for-the-badge&logo=discord)](https://discord.com/oauth2/authorize?client_id=YOUR_BOT_ID&permissions=8&scope=bot%20applications.commands)

</div>

---

## 📑 Table of Contents
- [✨ Features](#-features)
- [🚀 Installation](#-installation)
- [⚙️ Configuration](#️-configuration)
- [💡 Usage](#-usage)
- [🔧 Commands](#-commands)
- [📸 Preview](#-preview)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [📜 Changelog](CHANGELOG.md)

---

## 🔥 Features

- **Anti-Raid Protection**
  - Instantly detects mass joins and spam attacks
  - Automatically bans or quarantines suspicious users
  - Locks server settings during raids to prevent damage

- **User Authorization**
  - Custom role and permission management
  - Detailed control for admin, moderator, and other authorized roles
  - Automatically detects and intervenes in unauthorized actions by users

- **Unauthorized Action Prevention**
  - Monitors channel, role, message, and membership changes
  - Automatic alerts and logging for suspicious activities
  - Approval system for critical operations requiring admin confirmation

- **Advanced Logging System**
  - Logs all suspicious activities in detail
  - Sends real-time notifications to specified channels

- **Easy Setup and Configuration**
  - Simple, customizable configuration file
  - Modern codebase with Discord.js v14 support

---

## 🚀 Installation

### Prerequisites
- Node.js v16.9.0 or higher
- npm v7 or higher
- Discord.js v14
- A Discord Bot Token from the [Discord Developer Portal](https://discord.com/developers/applications)

### Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/HIMURAw/PX-Guard.git
   cd PX-Guard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the bot:
   ```bash
   node .
   # or using PM2 (recommended for production)
   npm install -g pm2
   pm2 start index.js --name "px-guard"
   ```

## ⚙️ Configuration

Edit the `config.js` file with your preferred settings. Here's an example configuration:

```javascript
module.exports = {
    discord: {
        token: "Your Discord Bot Token",
        guards_token: ["Your Discord Bot Token", "Your Discord Bot Token"],
        serverId: "your discord server id",
        voiceID: "your discord voice channel id"
    },
  // ... other configuration options
};
```

### Protection Features
- Automatic raid detection and prevention
- Role and permission management
- Suspicious activity monitoring

## 📸 Preview

![Dashboard Preview](https://cdn.discordapp.com/attachments/1392478452636192838/1399473068941774929/image.png?ex=688dbd9c&is=688c6c1c&hm=503b8488d1d77f4f6a73914cb1197e8942cc28631743d8008e31157fbe5dafa7&)

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) for details on how to contribute to this project.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### 🐛 Reporting Issues
Found a bug? Please open an issue on our [GitHub Issues](https://github.com/HIMURAw/PX-Guard/issues) page.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [Support Server](https://discord.gg/pxdev)
- [GitHub Repository](https://github.com/HIMURAw/PX-Guard)

## 🙏 Acknowledgments

- Built with ❤️ by [HIMURAw](https://github.com/HIMURAw)
- Thanks to all contributors who helped improve this project
- Special thanks to the Discord.js team for their amazing library

<div align="center">
  Made with :heart: and JavaScript
</div>
