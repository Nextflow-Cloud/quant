import Command from "../structures/Command";

export default new Command("volume", {
    name: "volume",
    description: "Sets the volume of the player.",
    // cooldown: 5000,
    // permissions: "EVERYONE",
    // aliases: [],
    options: [{
        name: "percentage",
        description: "The volume percentage",
        required: true,
        type: "INTEGER"
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
    const percentage = context.options.data[0].value as number;
    if (percentage <= 0 || percentage >= 101) return context.reply("Please enter a number from 1 to 100! :frowning:");
    player.setVolume(percentage);
    context.reply(`Set the volume to ${percentage}.`);
});
