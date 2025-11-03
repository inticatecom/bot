// Resources
import {CommandBuilder} from "../framework";
import {ContainerBuilder, MessageFlags, SlashCommandBuilder} from "discord.js";

/* A subcommand group for development related commands */
export default new CommandBuilder({
    data: new SlashCommandBuilder()
        .setName("dev")
        .setDescription("Development related commands.")
        .addSubcommand(subcommand => subcommand
            .setName("info")
            .setDescription("Replies with the bot's latency and networking information.")
        ),
    async execute(interaction) {
        // Variables
        const subcommand = interaction.options.getSubcommand(true);

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
                    flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral],
                });

                break;
            }
            /* Reload Slash Commands */
            case "reload": {
                break;
            }
        }
    }
})

function toMegabyte(bytes: number): number {
    return Math.floor(bytes / 1024 / 1024);
}