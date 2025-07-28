const { Schema, model, models } = require("mongoose");

module.exports = models.guard_data || model("guard_data", new Schema({
  guildID: { type: String, default: "" },
  bans: { type: Array, default: [] },
  roles: { type: Array, default: [] },
  categorys: { type: Array, default: [] },
  permissions: { type: Array, default: [] },
}));