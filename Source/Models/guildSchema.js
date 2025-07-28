const { Schema, model, models } = require("mongoose");

module.exports = models.guard_guildData || model("guard_guildData", new Schema({
  guildID: { type: String, default: "" },
  allowBots: { type: Array, default: [] },
  infos: { type: Array, default: [] },
}));