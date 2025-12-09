// Resources
import "dotenv";
import {FrameworkClient, console} from "./framework";

/** Main entry point of the application. Loads commands and events in the client. */
async function main() {
    const client = new FrameworkClient({intents: []}); // Initialize the Discord client.

    // Load Managers
    await client.commandsManager.load("./src/commands");
    await client.eventsManager.load("./src/events");

    /*
        await client.commandsManager.publish();

        Use this to publish the commands initially. Once published, you
        can comment this line out to avoid hitting rate limits. There is a built-in commands to re-publish them if
        needed later.
    */

    await client.login(process.env.DISCORD_BOT_TOKEN); // Log in to the Discord bot account with the bot token.
}

// Execute the main code.
main().then(() => {
    console.info("Connected to Discord successfully.");
});