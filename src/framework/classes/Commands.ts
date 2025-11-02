// Resources
import {fetchFilesFromDir, console} from "../utility";
import {pathToFileURL} from "url";
import {REST, Routes, type RESTPostAPIApplicationCommandsJSONBody} from "discord.js";

// Definitions
import type {FrameworkClient} from "../definitions";

// Enumerators
export enum PublishMethod {
    Global,
    Guild
}

/**
 * A class for handling command loading and publishing to Discord's servers. This makes it easier to manage commands
 * in a modular way without needing to work directly with the REST API.
 *
 * @example
 * const commands = new Commands(client);
 */
export default class Commands {
    /** The Discord client instance. */
    private client: FrameworkClient;
    /** The REST instance for making API calls to Discord. */
    private readonly rest = new REST().setToken(String(process.env.DISCORD_BOT_TOKEN));

    /**
     * Creates a new 'Commands' manager class.
     * @param client The Discord client instance.
     */
    constructor(client: FrameworkClient) {
        this.client = client;
    }

    /**
     * Loads and publishes the slash commands to Discord.
     * @param directory The directory for the command modules to be loaded from. Please keep in mind that this will
     * load files recursively meaning that folders inside of folders with files will also be loaded.
     * @param method The publish method to use. Keep in mind that global publishing can take longer and has higher
     * rate-limits. Use the guild method for development and testing and the global method when commands need to be
     * accessed by more than one guild. This default to 'Guild'.
     *
     * @example
     * commands.load("./src/commands", PublishMethod.Guild);
     */
    public async load(directory: string, method: PublishMethod = PublishMethod.Guild): Promise<void> {
        const locations = await fetchFilesFromDir(directory);
        const loaded: RESTPostAPIApplicationCommandsJSONBody[] = [];

        for (const location of locations) {
            const module = await import(pathToFileURL(location).href);

            if (module.default && module.default.execute) {
                this.client.commands.set(module.default.data.name, module.default);
                loaded.push(module.default.data.toJSON());
                console.debug(`Loaded command module from '${location}'.`);
            } else {
                console.warn(`Invalid command module at '${location}', missing 'execute' method.`);
            }
        }

        await this.publish(loaded, method);
        console.debug(`Loaded ${loaded.length} command(s) from '${directory}'.`);
    }

    /**
     * @private
     * Internal method for handling publishing the commands to Discord.
     *
     * @param commands The commands to publish.
     * @param method The method to use for publishing.
     *
     * @example
     * await this.publish(commands, PublishMethod.Global);
     */
    private async publish(commands: RESTPostAPIApplicationCommandsJSONBody[], method: PublishMethod): Promise<void> {
        try {
            const route = method === PublishMethod.Global ? Routes.applicationCommands(String(process.env.DISCORD_CLIENT_ID)) : Routes.applicationGuildCommands(String(process.env.DISCORD_CLIENT_ID), String(process.env.DEV_GUILD_ID));
            await this.rest.put(route, {body: commands});
        } catch (e) {
            console.error(e);
        }
    }
}