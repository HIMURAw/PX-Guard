const { Schema, model, models } = require("mongoose");

module.exports = models.guard_roleData || model("guard_roleData", new Schema({
  guildID: String,
  Id: String,
  Permissions: { type: Array, default: [] },
}));