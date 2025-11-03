// Resources
import {console} from "./utility";
import {Client, ClientOptions, Collection} from "discord.js";

// Framework Utilities
import Commands from "./classes/Commands";
import Events from "./classes/Events";
import CommandBuilder from "./classes/CommandBuilder";
import EventBuilder from "./classes/EventBuilder";

// Definitions
import type {FrameworkCommand} from "./definitions";

/**
 * An extended version of the Discord.js client including additional properties needed for the framework to function.
 *
 * @example
 * const client = new FrameworkClient();
 */
export class FrameworkClient extends Client {
    /** A collection of registered commands available to the client. */
    public commands: Collection<string, FrameworkCommand>;
    /** The commands manager instance. */
    public commandsManager: Commands;
    /** The events manager instance. */
    public eventsManager: Events;

    /**
     * Creates a new extended Discord client.
     * @param options The client options to use when instantiating the client.
     */
    constructor(options: ClientOptions) {
        super(options);
        this.commands = new Collection();
        this.commandsManager = new Commands(this);
        this.eventsManager = new Events(this);
    }
}

// Export Classes
export {Commands, Events, CommandBuilder, EventBuilder, console};