import Command from "../structures/Command";

export default new Command("shuffle", {
    name: "shuffle",
    description: "Shuffles the queue.",
    // cooldown: 5000,
    // permissions: "EVERYONE",
    // aliases: [],
    options: []
}, async (client, context) => {
    const member = await context.guild!.members.fetch(context.user.id);
    if (!member.voice.channel) return context.reply("Please connect to a voice channel! :frowning:");
    if (context.guild!.me!.voice.channel) {
        if (context.guild!.me!.voice.channel !== member.voice.channel) {
            return context.reply("I am not in the same voice channel as you! Please connect to the voice channel that I am in. :frowning:");
        }

    } else {
        return context.reply("Nothing is playing right now. :frowning:");
    }
    const player = client.manager.players.get(context.guild!.id);
    if (!player) return context.reply("Nothing is playing right now. :frowning:");
    player.queue.shuffle();
    context.reply("The queue has now been shuffled.");
});