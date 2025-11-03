// Resources
import {CommandBuilder} from "../framework";
import {SlashCommandBuilder} from "discord.js";

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
            case "info": {
                await interaction.deferReply();
                const memory = process.memoryUsage();

                await interaction.followUp(`${toMegabyte(memory.heapUsed)}/${toMegabyte(memory.heapTotal)}MB`);
                break;
            }
        }
    }
})

function toMegabyte(bytes: number): number {
    return Math.floor(bytes / 1024 / 1024);
}