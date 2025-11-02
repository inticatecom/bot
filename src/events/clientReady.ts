// Resources
import {EventBuilder, console, FrameworkClient} from "../framework";
import {Events} from "discord.js";

export default new EventBuilder<FrameworkClient>({
    event: Events.ClientReady,
    once: true,
    async execute(client) {
        console.info(`Logged in as '${client.user.tag}'.`)
        client.user.setActivity("Hey there!")
    }
})