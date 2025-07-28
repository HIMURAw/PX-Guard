const { bots_config: { guard_system: { prefixs } } } = require("../../../config.js")
const { emotes } = require("../../../config.js");
const bot = global.guard;

module.exports = async (message) => {
  if (message?.author?.bot || !message?.guild || !message?.content) return;

  let commands = prefixs.find(x => message.content.toLowerCase().startsWith(x));
  if (commands) {
    let args = message.content.split(" ").slice(1);
    let command = message.content.split(" ")[0].slice(commands.length).toLowerCase()
    let cmd = bot.default_Cmd.get(command) || bot.default_Cmd.get(bot.aliases.get(command));

    if (cmd) {
      cmd.run(bot, message, args, emotes);
    }
  }
};
module.exports.conf = {
  name: "messageCreate",
};