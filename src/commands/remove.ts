import Command from "../structures/Command";

export default new Command("remove", {
    name: "remove",
    description: "Removes a track from the queue.",
    // cooldown: 5000,
    // permissions: "EVERYONE",
    // aliases: [],
    options: [{
        name: "number",
        description: "The number of the track to remove",
        required: true,
        type: "INTEGER"
    }]
}, async (client, context) => {
    const member = await context.guild!.members.fetch(context.user.id);
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
    const number = context.options.data[0].value as number;
    try {
        player.queue.remove(number - 1);
    } catch (e) {
        client.error(e as Error);
        return context.reply("Could not remove that track from the queue. Please try using the queue command to find the track number.");
    }
    context.reply("Removed that track from the queue.");
});
