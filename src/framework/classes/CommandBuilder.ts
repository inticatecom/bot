// Resources
import type {FrameworkCommand} from "../definitions";

/**
 * Creates a new command structure for the framework to then utilize.
 *
 * @example
 * export default class CommandBuilder {
 *      data: new SlashCommandBuilder().setName("ping").setDescription("Replies with Pong!"),
 *      async execute(interaction: ChatInputCommandInteraction) {
 *          await interaction.reply("Pong!");
 *      }
 * }
 */
export default class CommandBuilder {
    /** The command data. */
    public readonly data: FrameworkCommand["data"];
    /** The function to execute when the command is triggered. */
    public readonly execute: FrameworkCommand["execute"];

    /**
     * Creates a new command structure.
     * @param properties The properties of the command.
     */
    constructor(properties: FrameworkCommand) {
        this.data = properties.data;
        this.execute = properties.execute;
    }
}