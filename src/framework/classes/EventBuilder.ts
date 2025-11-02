// Resources
import {Interaction} from "discord.js";

// Definitions
import type {FrameworkEvent} from "../definitions";

/**
 * Creates a new event for the framework to utilize.
 *
 * @example
 * export default class EventBuilder {
 *     event: Events.InteractionCreate,
 *     async execute(interaction: Interaction) {
 *          // Your code here
 *     }
 * }
 */
export default class EventBuilder<DataType = Interaction> {
    /** The event type. */
    public readonly event: FrameworkEvent["event"];
    /** Whether the event should be executed only once. */
    public readonly once: FrameworkEvent["once"];
    /** The function to execute when the event is triggered. */
    public readonly execute: FrameworkEvent<DataType>["execute"];

    /**
     * Creates a new event structure.
     * @param properties The properties of the event.
     */
    constructor(properties: FrameworkEvent<DataType>) {
        this.event = properties.event;
        this.once = properties.once;
        this.execute = properties.execute;
    }
}