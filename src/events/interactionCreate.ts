// Resources
import {EventBuilder, console} from "../framework";
import {ContainerBuilder, Events, MessageFlags} from "discord.js";
import {FrameworkClient, FrameworkCommand} from "../framework/definitions";

export default new EventBuilder({
    event: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isChatInputCommand()) return;

        const command = ((interaction.client as FrameworkClient).commands.get(interaction.commandName)) as FrameworkCommand;
        if (!command) return;

        try {
            await command.execute(interaction);
            console.debug(`User '${interaction.user.tag}' executed command '/${interaction.commandName}'.`);
        } catch (e) {
            console.error(e);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({
                    components: [getErrorMessage("500")],
                    flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2]
                });
            } else {
                await interaction.reply({
                    components: [getErrorMessage("500")],
                    flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2]
                });
            }
        }
    }
});

/**
 * Creates a well-formatted error message container.
 * @param code The error code to display to the user.
 *
 * @returns A container builder with the error message.
 */
function getErrorMessage(code: string): ContainerBuilder {
    return new ContainerBuilder()
        .setAccentColor(0xFF0000)
        .addTextDisplayComponents(display =>
            display.setContent("## Unknown Error")
        )
        .addTextDisplayComponents(display =>
            display.setContent("Unfortunately, an unknown error has occurred. Please try again later or contact our" +
                " development team with the error code provided below.")
        )
        .addSeparatorComponents(separator => separator)
        .addTextDisplayComponents(display =>
            display.setContent(`-# Error Code: ${code}`)
        );
}