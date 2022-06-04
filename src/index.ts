import { Database, DatabaseSchema, Environment } from "@nextium/common";
import Client from "./structures/Client";

Environment.load(["TOKEN"], true);

const client = new Client({ 
    intents: ["GUILDS", "GUILD_VOICE_STATES"],
    ws: {
        compress: true,
        version: 10
    },
    partials: [
        "CHANNEL",
        "GUILD_MEMBER", 
        "GUILD_SCHEDULED_EVENT", 
        "MESSAGE", 
        "REACTION", 
        "USER"
    ],
    http: {
        version: 10
    },
    presence: {
        activities: [{
            type: "PLAYING",
            name: "with my friends"
        }],
        status: "online"
    }
}, {
    nodes: [
        {
            host: "localhost",
            port: 2333,
            password: "youshallnotpass",
        },
    ],
    send(id, payload) {
        const guild = client.guilds.cache.get(id);
        if (guild) guild.shard.send(payload);
    },
    // defaultSearchPlatform: "soundcloud",
});

await client.run(process.env.TOKEN!, { guildId: "738768458627416116" });
