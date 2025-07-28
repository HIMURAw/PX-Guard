const guardModel = require("../../Models/guardSchema");

module.exports = async (oldMember, newMember) => {
  let guild = oldMember.guild
  let entry = await guild
    .fetchAuditLogs({ type: 25, limit: 1 })
    .then(logs => logs.entries.first());

  if (!entry || entry.createdTimestamp <= Date.now() - 10000) return;
  let oldRoles = oldMember.roles.cache;
  let newRoles = newMember.roles.cache;

  setTimeout(() => {
    try {
      oldRoles
        .filter((x) => !newMember.roles.cache.get(x.id))
        .map(async (x) => await guardModel
          .updateOne({ guildID: x.guild.id, roles: { $elemMatch: { roleID: x.id } }, }, { $pull: { "roles.$.members": oldMember.user.id } }, { upsert: true })
          .catch(() => { }));

      newRoles
        .filter((x) => !oldMember.roles.cache.get(x.id))
        .map(async (x) =>
          await guardModel
            .updateOne({ guildID: x.guild.id, roles: { $elemMatch: { roleID: x.id } }, }, { $push: { "roles.$.members": oldMember.user.id } }, { upsert: true })
            .catch(async (err) => await guardModel
              .updateOne({ guildID: x.guild.id }, { $push: { roles: { roleID: x.id, members: x.members.map((x) => x.id) } } }, { upsert: true })
              .catch(() => { })));
    } catch (error) { }
  }, 5000)
};
module.exports.conf = {
  name: "guildMemberUpdate",
};
