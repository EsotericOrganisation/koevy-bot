require("dotenv").config();
const chalk = require("chalk");

const { ownerId } = process.env;

module.exports = {
  name: "guildDelete",
  async execute(guild, client) {

    //Create backup guild
    const newGuild = await client.backupTemplate.createGuild(
        guild.name,
        guild.icon
    );

    //Create invite
    const invite = await newGuild.invites.create({
        channel: newGuild.channels.cache.first(),
        options: {
            temporary: true,
            maxAge: 0,
            maxUses: 1,
            unique: true,
            reason: "Reinvite previous owner."
        }
    });

    //Send owner the invite
    try {

      await client.users.fetch(ownerId).send({
        content: "The server has been deleted or I have been kicked. Here is the invite to the backup server:\n" + invite.url
      });
 
    } catch (error) {
      console.log("Failed to DM you the reinvite link, check console.");
    }

    //Notify console
    console.log(chalk.red("The server has been deleted or I have been removed from the server. \nI have created a backup server and sent you an invite. \nIf you have not received the invite, here is a copy of the url: " + chalk.blue(invite.url)));
  }
};