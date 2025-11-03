// Resources
import {CommandBuilder} from "../framework";
import {SlashCommandBuilder} from "discord.js";

export default new CommandBuilder({
    data: new SlashCommandBuilder().setName("help").setDescription("Provides help information for available commands."),
    async execute(interaction) {
        await interaction.reply("This command will be here soon, don't worry!");
    }
});