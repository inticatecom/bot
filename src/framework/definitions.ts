// Resources
import type {
    ChatInputCommandInteraction,
    Client,
    SlashCommandBuilder,
    SlashCommandSubcommandsOnlyBuilder,
    Events, Interaction
} from "discord.js";

/**
 * A file extension enforcing you to prefix a string with '.'.
 */
export type Extension = `.${string}`;

export interface FrameworkClient extends Client {
    commands: Map<string, unknown>;
}

export interface FrameworkCommand {
    data: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder;
    execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}

export interface FrameworkEvent<DataType = Interaction> {
    event: Events;
    once?: boolean;
    execute: (data: DataType) => Promise<void>;
}