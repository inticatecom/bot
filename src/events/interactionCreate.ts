// Resources
import {EventBuilder, console} from "../framework";
import {Events, MessageFlags} from "discord.js";
import {FrameworkClient, FrameworkCommand} from "../framework/definitions";

export default new EventBuilder({
    event: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isChatInputCommand()) return;

        const command = ((interaction.client as FrameworkClient).commands.get(interaction.commandName)) as FrameworkCommand;
        if (!command) return;

        try {
            await command.execute(interaction);
        } catch (e) {
            console.error(e);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({
                    content: "There was an error while executing this command!",
                    flags: MessageFlags.Ephemeral
                });
            } else {
                await interaction.reply({
                    content: "There was an error while executing this command!",
                    flags: MessageFlags.Ephemeral
                });
            }
        }
    }
})