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
    private readonly client: FrameworkClient;
    /** The REST instance for making API calls to Discord. */
    private readonly rest = new REST().setToken(String(process.env.DISCORD_BOT_TOKEN));
    /** The loaded commands ready for publishing. */
    private loaded: RESTPostAPIApplicationCommandsJSONBody[] = []

    /**
     * Creates a new 'Commands' manager class.
     * @param client The Discord client instance.
     */
    constructor(client: FrameworkClient) {
        this.client = client;
    }

    /**
     * @public
     * Loads the commands from the provided directory recursively. Please keep in mind you will still need to call
     * the publish method to register the commands with Discord after loading them.
     *
     * @param directory The directory for the command modules to be loaded from. Please keep in mind that this will
     * load files recursively meaning that folders inside of folders with files will also be loaded.
     *
     * @example
     * await commands.load("./src/commands");
     * await commands.publish(PublishMethod.Guild);
     */
    public async load(directory: string): Promise<void> {
        const locations = await fetchFilesFromDir(directory);
        let loaded: number = 0;

        for (const location of locations) {
            const module = await import(pathToFileURL(location).href);

            if (module.default && module.default.execute) {
                this.client.commands.set(module.default.data.name, module.default);
                this.loaded.push(module.default.data.toJSON());

                loaded++;
                console.debug(`Loaded command module from '${location}'.`);
            } else {
                console.warn(`Invalid command module at '${location}', missing 'execute' method.`);
            }
        }

        console.info(`Added ${loaded} command(s) from '${directory}'.`);
    }

    /**
     * @public
     * Resets the loaded commands and loads them with the new ones. Please keep in mind you will still have to
     * publish the commands again after reloading them.
     *
     * @param directory The directory for the command modules to be reloaded from.
     *
     * @example
     * await commands.reload("./src/commands");
     * await commands.publish(PublishMethod.Guild);
     */
    public async reload(directory: string): Promise<void> {
        this.loaded = []; // Clear existing loaded commands.

        console.warn(`Cleared commands from existing loaded.`);
        await this.load(directory);
    }

    /**
     * @public
     * Publishes the loaded commands to Discord using the specified method.
     *
     * @param method The method to use for publishing.
     *
     * @example
     * await this.publish(PublishMethod.Global);
     */
    public async publish(method: PublishMethod = PublishMethod.Guild): Promise<string[]> {
        try {
            await this.rest.put(this.getRoute(method), {body: this.loaded});

            console.info(`Published ${this.loaded.length} command(s) using method '${PublishMethod[method]}'.`);
            return this.loaded.map(cmd => cmd.name);
        } catch (e) {
            console.error(e);
        }

        return [];
    }

    /**
     * @private
     * Fetches the appropriate route for publishing commands based on the provided method.
     *
     * @param method The method to use for publishing.
     * @returns The API route for publishing commands.
     *
     * @example
     * const route = this.getRoute(PublishMethod.Guild);
     */
    private getRoute(method: PublishMethod): `/${string}` {
        return method === PublishMethod.Global ? Routes.applicationCommands(String(process.env.DISCORD_CLIENT_ID)) : Routes.applicationGuildCommands(String(process.env.DISCORD_CLIENT_ID), String(process.env.DEV_GUILD_ID));
    }
}