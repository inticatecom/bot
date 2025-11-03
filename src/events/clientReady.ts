// Resources
import {EventBuilder, FrameworkClient} from "../framework";
import {Events} from "discord.js";

export default new EventBuilder<FrameworkClient>({
    event: Events.ClientReady,
    once: true,
    async execute(client) {
        client.user?.setActivity("Hey there!")
    }
})