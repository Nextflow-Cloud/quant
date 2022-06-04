import Command from "../structures/Command";

export default new Command("pause", {
    name: "pause",
    description: "Pauses or resumes the playing track.",
    // cooldown: 5000,
    // aliases: [],
    // permissions: "EVERYONE",
    options: []
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
    player.pause(player.playing);
    context.reply(`The queue has been ${player.playing ? "resumed" : "paused"}.`);
});
