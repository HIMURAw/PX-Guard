const { Schema, model, models } = require("mongoose");

module.exports = models.guard_userData || model("guard_userData", new Schema({
  guildID: { type: String, default: "" },
  userID: { type: String, default: "" },

  whitelistGuardPoint: { type: Number, default: 0 },  
  guardPoint: { type: Number, default: 0 },  

  channelGuard: { type: Object, default: {} },  
  roleGuard: { type: Object, default: {} },  
  emoteGuard: { type: Object, default: {} },  
  memberGuard: { type: Object, default: {} },  
  guildGuard: { type: Object, default: {} },
}));