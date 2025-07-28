// utils/checkPermissions.js
const Whitelist = require('../database/whitelistSchema');
module.exports = async function isUserWhitelisted(userId) {
    return await Whitelist.findOne({ userId }) ? true : false;
};
