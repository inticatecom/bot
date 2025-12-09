// Resources
import type {
    ChatInputCommandInteraction,
    Client,
    SlashCommandBuilder,
    SlashCommandSubcommandsOnlyBuilder,
    Events,
    Interaction,
    SlashCommandOptionsOnlyBuilder
} from "discord.js";

/** A file extension enforcing you to prefix a string with '.'. */
export type Extension = `.${string}`;

/** The framework client base. Adds an additional map for commands storage. */
export interface FrameworkClient extends Client {
    commands: Map<string, unknown>;
}

type CommandData = SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder | SlashCommandOptionsOnlyBuilder;

/** Represents a command structure for the framework. */
export interface FrameworkCommand {
    data: CommandData;
    execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}

/** Represents an event structure for the framework. */
export interface FrameworkEvent<DataType = Interaction> {
    event: Events;
    once?: boolean;
    execute: (data: DataType) => Promise<void>;
}