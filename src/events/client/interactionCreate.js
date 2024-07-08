const { InteractionType } = require(`discord.js`);

module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    if (interaction.isChatInputCommand()) {
      const { commands } = client;
      const { commandName } = interaction;
      const command = commands.get(commandName);
      if (!command) return;

      try {
        await command.execute(interaction, client);
      } catch (error) {
        console.error(error);
        await interaction.followUp({
          content: `Something went Wrong`,
          ephemeral: true,
        });
      }
    } else if (interaction.isButton()) {
      const { buttons } = client;
      const { customId } = interaction;
      const button = buttons.get(customId);
      if (!button) return new Error("There is no Code for this Button!");

      try {
        await button.execute(interaction, client);
      } catch (err) {
        console.error(err);
      }
    } else if (interaction.isStringSelectMenu()) {
      const { selectMenus } = client;
      const { customId } = interaction;
      const menu = selectMenus.get(customId);
      if (!menu) return new Error("There is no code for this select Menu");

      try {
        await menu.execute(interaction, client);
      } catch (error) {
        console.error(error);
      }
    } else if (interaction.type == InteractionType.ModalSubmit) {
      const { modals } = client;
      const { customId } = interaction;
      const modal = modals.get(customId);
      if (!modal) return new Error("There is no code for this Modal.");

      try {
        await modal.execute(interaction, client);
      } catch (error) {
        console.error(error);
      }
    } else if (
      interaction.type == InteractionType.ApplicationCommandAutocomplete
    ) {
      /**Check if @InteractionType is a slash command autocomplete */
      const { commands } =
        client; /**Get the @commmands collection from @client (declared in main.js)*/
      const { commandName } =
        interaction; /**Get the @commandName from @interaction */
      const command =
        commands.get(
          commandName
        ); /**Look for @commandName in the @commands collection */
      if (!command)
        return console.error(
          new Error(
            `Loading autocomplete failed for command: ${commandName} of collection ${commands}`
          )
        );

      try {
        await command.autocomplete(
          interaction,
          client
        ); /**Run the autocomplete with parameters @interaction and @client (Autocomplete is followed by a @command execute()) */
      } catch (err) {
        console.error(err);
      }
    }
  },
};
