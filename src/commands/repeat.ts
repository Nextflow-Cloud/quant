import Command from "../structures/Command";

export default new Command("repeat", {
    name: "repeat",
    description: "Sets the queue or track repeat.",
    // cooldown: 5000,
    // permissions: "EVERYONE",
    // aliases: [],
    options: [{
        name: "type",
        description: "Whether to repeat the queue or the track",
        required: true,
        type: "STRING",
        choices: [{
            name: "queue",
            value: "queue"
        }, {
            name: "track",
            value: "track"
        }]
    }]
}, async (client, context) => {
    const member = await context.guild?.members.fetch(context.user.id);
    if (!member!.voice.channel) return context.reply("Please connect to a voice channel! :frowning:");
    if (context.guild!.me!.voice.channel) {
        if (context.guild!.me!.voice.channel !== member!.voice.channel) {
            return context.reply("I am not in the same voice channel as you! Please connect to the voice channel that I am in. :frowning:");
        }
    } else {
        return context.reply("Nothing is playing right now. :frowning:");
    }
    const player = client.manager.players.get(context.guild!.id);
    if (!player) return context.reply("Nothing is playing right now. :frowning:");
    const type = context.options.data[0].value as string;
    if (type === "track") {
        const repeat = !player.trackRepeat;
        player.setTrackRepeat(repeat);
        return context.reply(`Set the track repeat to ${repeat}.`);;
    }
    if (type === "queue") {
        const repeat = !player.queueRepeat;
        player.setQueueRepeat(repeat);
        return context.reply(`Set the queue repeat to ${repeat}.`);
    }
});
