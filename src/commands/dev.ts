// Resources
import {CommandBuilder, type FrameworkClient} from "../framework";
import {ContainerBuilder, MessageFlags, SlashCommandBuilder} from "discord.js";

// Variables
const developers = String(process.env.DEVELOPER_IDS).split(",");

/* A subcommand group for development related commands */
export default new CommandBuilder({
    data: new SlashCommandBuilder()
        .setName("dev")
        .setDescription("Development related commands.")
        .addSubcommand(subcommand => subcommand
            .setName("info")
            .setDescription("Replies with the bot's latency and networking information.")
        ).addSubcommand(subcommand => subcommand
            .setName("publish")
            .setDescription("Reload the bot's slash commands.")
            .addStringOption(option =>
                option
                    .setName("method")
                    .setDescription("The publish method to use when publishing the commands.")
                    .setRequired(false)
                    .addChoices(
                        {name: "Global", value: "global"},
                        {name: "Guild", value: "guild"}
                    )
            )
        ),
    async execute(interaction) {
        // Variables
        const subcommand = interaction.options.getSubcommand(true);

        if (!developers.includes(interaction.user.id)) {
            await interaction.reply({
                components: [
                    new ContainerBuilder()
                        .setAccentColor(0xFF0000)
                        .addTextDisplayComponents(display =>
                            display.setContent("## Access Denied")
                        )
                        .addTextDisplayComponents(display =>
                            display.setContent("You do not have permission to use this command. If you believe this is an" +
                                " error, please contact the bot's development team.")
                        )
                        .addSeparatorComponents(separator => separator)
                        .addTextDisplayComponents(display =>
                            display.setContent("-# Developed by Inticate Softworks")
                        )
                ],
                flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2]
            });
            return;
        }

        switch (subcommand) {
            /* Development Information */
            case "info": {
                await interaction.deferReply({flags: MessageFlags.Ephemeral});
                const memory = process.memoryUsage();

                const container = new ContainerBuilder()
                    .addTextDisplayComponents(display =>
                        display.setContent("## Development Statistics")
                    )
                    .addTextDisplayComponents(display =>
                        display.setContent("Important information regarding the bot's statistics. This information" +
                            " is only visible to you and should not be shared publicly.")
                    )
                    .addSeparatorComponents(separator => separator)
                    .addTextDisplayComponents(display =>
                        display.setContent(`### Memory Usage\n${toMegabyte(memory.heapUsed)}/${toMegabyte(memory.heapTotal)} MB`)
                    )
                    .addSeparatorComponents(separator => separator)
                    .addTextDisplayComponents(display =>
                        display.setContent("-# Developed by Inticate Softworks")
                    )
                ;

                await interaction.followUp({
                    components: [container],
                    flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral]
                });

                break;
            }
            /* Reload Slash Commands */
            case "publish": {
                await interaction.deferReply({flags: MessageFlags.Ephemeral});
                const method = interaction.options.get("method", false);
                const loaded = await (interaction.client as FrameworkClient).commandsManager.publish(method && method.value === "global" ? 0 : 1);

                const container = new ContainerBuilder()
                    .addTextDisplayComponents(display =>
                        display.setContent("## Command Publishing")
                    )
                    .addTextDisplayComponents(display =>
                        display.setContent(`The following ${loaded.length} slash command(s) have been published successfully to Discord.`)
                    )
                    .addSeparatorComponents(separator => separator)
                    .addTextDisplayComponents(display =>
                        display.setContent(loaded.map(command => `- /${command}`).join("\n"))
                    )
                    .addSeparatorComponents(separator => separator)
                    .addTextDisplayComponents(display =>
                        display.setContent("-# Developed by Inticate Softworks")
                    )
                ;

                await interaction.followUp({
                    components: [container],
                    flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2]
                });

                break;
            }
        }
    }
});

/**
 * Converts bytes to megabytes.
 *
 * @param bytes The amount of bytes.
 * @returns The amount of bytes in megabytes.
 *
 * @example
 * toMegabyte(1048576); // 1
 */
function toMegabyte(bytes: number): number {
    return Math.floor(bytes / 1024 / 1024);
}