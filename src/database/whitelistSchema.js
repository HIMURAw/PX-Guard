// database/whitelistSchema.js
const mongoose = require('mongoose');
const whitelistSchema = new mongoose.Schema({
    userId: String,
});
module.exports = mongoose.model('Whitelist', whitelistSchema);
