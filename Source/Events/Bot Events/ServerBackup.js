const guardModel = require("../../Models/guardSchema");
const roleModel = require("../../Models/roleSchema");
const bot = global.guard;

module.exports = async () => {
  bot.guilds.cache
    .map(async (server) => {
      await guardModel.deleteMany({});
      await roleModel.deleteMany({});

      server.channels.cache
        .filter((x) => !x.isThread())
        .filter((x) => x.permissionOverwrites.cache.size > 0)
        .map(async (x) => new roleModel({ Id: x.id, Permissions: x.permissionOverwrites.cache.map((permission) => ({ id: permission.id, type: permission.type, allow: permission.allow.toArray(), deny: permission.deny.toArray() })), }).save());

      server.channels.cache.filter((x) => !x.isThread())
        .filter((x) => x.type === 4)
        .map(async (x) => {
          let channels = server.channels.cache.filter((x) => !x.isThread()).filter((y) => y.parentId === x.id).map((x) => x.id)

          if (channels.length > 0) {
            await guardModel
              .updateOne({ guildID: server.id }, { $push: { categorys: { channelID: x.id, channels: channels } } }, { upsert: true });
          }
        });

      server.roles.cache
        .filter((x) => x.name !== "@everyone")
        .filter((x) => x.members.size > 0)
        .filter((x) => !x.managed)
        .map(async (x) => await guardModel
          .updateOne({ guildID: server.id }, { $push: { roles: { roleID: x.id, members: x.members.map((x) => x.id) } } }, { upsert: true }));

      await server.bans
        .fetch()
        .then(async (g) => {
          let bans = [...g.values()]
          await guardModel
            .updateOne({ guildID: server.id }, { $set: { bans: bans.map((x) => ({ userID: x.user.id, reason: x.reason })) } }, { upsert: true })
            .catch(() => { });
        })
        .catch(() => { });
    })
};
module.exports.conf = {
  name: "serverBackup",
};
