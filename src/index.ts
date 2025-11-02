// Resources
import * as dotenv from "dotenv";
import {FrameworkClient, Commands, Events, console} from "./framework";

dotenv.config({quiet: true}); // Load environment variables from '.env' file.

/** Main entry point of the application. Loads commands and events in the client. */
async function main() {
    // Initialize the Discord client.
    const client = new FrameworkClient({
        intents: []
    });

    // Load the commands.
    const commands = new Commands(client);
    await commands.load("./src/commands");

    // Load the events.
    const events = new Events(client);
    await events.load("./src/events");

    await client.login(process.env.DISCORD_BOT_TOKEN); // Log in to the Discord bot account with the bot token.
}

// Execute the main code.
main().then(() => {
    console.info("Everything started normally.");
});