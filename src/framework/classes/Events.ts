// Resources
import {fetchFilesFromDir, console} from "../utility";
import {pathToFileURL} from "url";

// Definitions
import type {FrameworkClient} from "../definitions";

/**
 * A class responsible for loading and registering event handlers for the client.
 *
 * @example
 * const events = new Events(client);
 * await events.load("./src/events");
 */
export default class Events {
    /** The client instance. */
    private readonly client: FrameworkClient;

    /**
     * Creates a new 'Events' manager class.
     * @param client The Discord client instance.
     */
    constructor(client: FrameworkClient) {
        this.client = client;
    }

    /**
     * @public
     * Loads event module from the specified directory recursively to the client.
     *
     * @param directory The directory to load event modules from.
     *
     * @example
     * await events.load("./src/events");
     */
    public async load(directory: string): Promise<void> {
        const events = await fetchFilesFromDir(directory);
        let loaded = 0;

        for (const eventPath of events) {
            const event = await import(pathToFileURL(eventPath).href);

            if (!event.default || !event.default.event || !event.default.execute) {
                console.warn(`Event '${eventPath}' not found`);
                continue;
            }

            if (event.default.once) {
                this.client.once(event.default.event, (...args) =>
                    event.default.execute(...args)
                );
            } else if (!event.default.once) {
                this.client.on(event.default.event, (...args) =>
                    event.default.execute(...args)
                );
            }

            loaded += 1;
            console.debug(`Loaded event module from '${eventPath}'.`);
        }

        console.info(`Added ${loaded} event(s) from '${directory}'.`);
    }
}