const { Schema, model, models } = require("mongoose");

module.exports = models.genel_permData || model("genel_permData", new Schema({
  guildID: { type: String, default: "" },
  roleID: { type: String, default: "" },
  userID: { type: String, default: "" },
  permissions: { type: Array, default: [] },  
}));