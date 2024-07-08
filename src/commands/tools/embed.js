const {
  SlashCommandBuilder,
  EmbedBuilder,
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js");
const { writeFileSync, readFileSync } = require("fs");

const optionArray = [
  { name: "Title", value: "title" },
  { name: "Description", value: "description" },
  { name: "Colour", value: "colour" },
  { name: "Image", value: "image" },
  { name: "Thumbnail", value: "thumbnail" },
  { name: "URL", value: "url" },
  { name: "Timestamp", value: "timestamp" },
  { name: "Author Name", value: "authorName" },
  { name: "Author Icon URL", value: "authorIconURL" },
  { name: "Author Link", value: "authorLink" },
  { name: "Footer Text", value: "footerText" },
  { name: "Footer Icon URL", value: "footerIconURL" },
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName("embed")
    .setDescription("Edit and send the embed builder.")
    .addSubcommand((option) =>
      option
        .setName("clear")
        .setDescription("Clear the embed of it's settings.")
    )
    .addSubcommand((option) =>
      option.setName("preview").setDescription("Preview the embed.")
    )
    .addSubcommand((option) =>
      option
        .setName("send")
        .setDescription("Send the embed")
        .addBooleanOption((option) =>
          option
            .setName("ping-everyone")
            .setDescription("Whether to ping everyone.")
        )
    )
    .addSubcommand((option) =>
      option
        .setName("edit")
        .setDescription("Edit the embed components.")
        .addStringOption((option) =>
          option
            .setName("component-1")
            .setDescription("The first option to edit.")
            .addChoices(...optionArray)
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("component-2")
            .setDescription("The second option to edit.")
            .addChoices(...optionArray)
        )
        .addStringOption((option) =>
          option
            .setName("component-3")
            .setDescription("The third option to edit.")
            .addChoices(...optionArray)
        )
        .addStringOption((option) =>
          option
            .setName("component-4")
            .setDescription("The fourth option to edit.")
            .addChoices(...optionArray)
        )
        .addStringOption((option) =>
          option
            .setName("component-5")
            .setDescription("The fifth option to edit.")
            .addChoices(...optionArray)
        )
    )
    .addSubcommandGroup((group) =>
      group
        .setName("field")
        .setDescription("Add, remove and edit embed fields.")
        .addSubcommand((option) =>
          option.setName("add").setDescription("Add a field to the embed.")
        )
        .addSubcommand((option) =>
          option
            .setName("remove")
            .setDescription("Remove a field from the embed.")
            .addNumberOption((option) =>
              option
                .setName("field-number")
                .setDescription("The number of field to remove.")
                .setMinValue(1)
                .setMaxValue(25)
                .setRequired(true)
            )
        )
        .addSubcommand((option) =>
          option
            .setName("edit")
            .setDescription("Edit a field of the embed.")
            .addNumberOption((option) =>
              option
                .setName("field-number")
                .setDescription("The number of field to edit.")
                .setMinValue(1)
                .setMaxValue(25)
                .setRequired(true)
            )
        )
    ),
  async execute(interaction) {
    const embed = JSON.parse(readFileSync("./src/json/embed.json"));

    if (
      !embed.title &&
      !embed.description &&
      !embed.author?.name &&
      (interaction.options.getSubcommand() === "preview" ||
        interaction.options.getSubcommand() === "send")
    ) {
      return await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription("❌ Can't send an empty message!")
            .setColor(0x2f3136),
        ],
        ephemeral: true,
      });
    }

    switch (interaction.options.getSubcommand()) {
      case "clear": {
        writeFileSync("./src/json/embed.json", "{}");

        await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription("✅ Successfully cleared the embed.")
              .setColor(0x2f3136),
          ],
          ephemeral: true,
        });
        break;
      }
      case "preview": {
        await interaction.reply({
          embeds: [new EmbedBuilder(embed)],
          ephemeral: true,
        });
        break;
      }
      case "send": {
        await interaction.deferReply({ ephemeral: true });

        await interaction.channel.send({
          embeds: [new EmbedBuilder(embed)],
          content: interaction.options.getBoolean("ping-everyone")
            ? "@everyone"
            : "",
        });

        await interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setDescription("✅ Successfully sent the embed.")
              .setColor(0x2f3136),
          ],
          ephemeral: true,
        });
        break;
      }
      case "edit": {
        if (interaction.options.getSubcommandGroup() === "field") {
          const fieldNumber = interaction.options.getNumber("field-number");

          if (!embed.fields?.[fieldNumber - 1]) {
            return await interaction.reply({
              embeds: [
                new EmbedBuilder()
                  .setDescription("❌ That field does not exist.")
                  .setColor(0x2f3136),
              ],
              ephemeral: true,
            });
          }

          return await interaction.showModal(
            new ModalBuilder()
              .setTitle("Edit Field")
              .setCustomId("embedEditField")
              .addComponents(
                new ActionRowBuilder().addComponents(
                  new TextInputBuilder()
                    .setLabel("Field Number")
                    .setStyle(TextInputStyle.Short)
                    .setCustomId("fieldNumber")
                    .setValue(`${fieldNumber}`)
                ),
                new ActionRowBuilder().addComponents(
                  new TextInputBuilder()
                    .setLabel("Field Name")
                    .setStyle(TextInputStyle.Short)
                    .setCustomId("fieldName")
                    .setValue(embed.fields[fieldNumber - 1].name)
                ),
                new ActionRowBuilder().addComponents(
                  new TextInputBuilder()
                    .setLabel("Field Value")
                    .setStyle(TextInputStyle.Short)
                    .setCustomId("fieldValue")
                    .setValue(embed.fields[fieldNumber - 1].value)
                ),
                new ActionRowBuilder().addComponents(
                  new TextInputBuilder()
                    .setLabel("Field Inline")
                    .setStyle(TextInputStyle.Short)
                    .setCustomId("fieldInline")
                    .setValue(`${embed.fields[fieldNumber - 1].inline}`)
                    .setRequired(false)
                )
              )
          );
        }

        let actionRows = [];

        for (let i = 1; i <= 5; i++) {
          if (
            actionRows.forEach((row) => {
              if (
                row.components[0].data.custom_id ===
                interaction.options.getString(`component-${i}`)
              ) {
                return true;
              }
            }) ||
            !interaction.options.getString(`component-${i}`)
          ) {
            continue;
          }

          const embedValue =
            embed[interaction.options.getString(`component-${i}`)];

          actionRows.push(
            new ActionRowBuilder().addComponents(
              new TextInputBuilder()
                .setLabel(interaction.options.getString(`component-${i}`))
                .setCustomId(interaction.options.getString(`component-${i}`))
                .setStyle(TextInputStyle.Paragraph)
                .setValue(
                  typeof embedValue === "string"
                    ? embedValue
                    : typeof embedValue === "object"
                    ? Object.keys(embedValue).length
                      ? embedValue[Object.keys(embedValue)[0]]
                      : ""
                    : ""
                )
                .setRequired(false)
            )
          );
        }

        if (!actionRows.length) {
          return await interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setDescription("❌ Duplicate arguments provided")
                .setColor(0x2f3136),
            ],
            ephemeral: true,
          });
        }

        await interaction.showModal(
          new ModalBuilder()
            .setTitle("Edit Embed")
            .setCustomId("embedModal")
            .addComponents(...actionRows)
        );
        break;
      }
      case "add": {
        await interaction.showModal(
          new ModalBuilder()
            .setTitle("Add Field")
            .setCustomId("embedAddField")
            .addComponents(
              new ActionRowBuilder().addComponents(
                new TextInputBuilder()
                  .setLabel("Field Name")
                  .setStyle(TextInputStyle.Short)
                  .setRequired(true)
                  .setCustomId("fieldName")
              ),
              new ActionRowBuilder().addComponents(
                new TextInputBuilder()
                  .setLabel("Field Value")
                  .setStyle(TextInputStyle.Paragraph)
                  .setRequired(true)
                  .setCustomId("fieldValue")
              ),
              new ActionRowBuilder().addComponents(
                new TextInputBuilder()
                  .setLabel("Field Inline")
                  .setStyle(TextInputStyle.Short)
                  .setRequired(false)
                  .setCustomId("fieldInline")
              )
            )
        );
        break;
      }
      case "remove": {
        const fieldNumber = interaction.options.getNumber("field-number");

        if (!embed.fields?.[fieldNumber - 1]) {
          return await interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setDescription("❌ That field does not exist.")
                .setColor(0x2f3136),
            ],
            ephemeral: true,
          });
        }

        embed.fields.splice(fieldNumber - 1, 1);

        writeFileSync("./src/json/embed.json", JSON.stringify(embed));

        await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription("✅ Successfully removed the field.")
              .setColor(0x2f3136),
          ],
          ephemeral: true,
        });
        break;
      }
    }
  },
};