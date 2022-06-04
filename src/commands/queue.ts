import { MessageEmbed, MessageButton, MessageActionRow, User } from "discord.js";
import Command from "../structures/Command";

export default new Command("queue", {
    name: "queue",
    description: "View the queue.",
    // cooldown: 5000,
    // permissions: "EVERYONE",
    // aliases: [],
    options: []
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
    const embed = new MessageEmbed().setTitle("Current queue");
    var description = `__**Currently playing**__\n\`${player.queue.current!.title}\` | Requested by ${(player.queue.current!.requester as User).tag}\n\n`;
    for (var i = 0; i < player.queue.length; i++) {
        var first = description;
        if (i === 0) {
            description += `__**Queue**__\n1. \`${player.queue[i].title}\` | Requested by ${(player.queue[i].requester as User).tag}\n`;
        } else {
            description += `${i + 1}. \`${player.queue[i].title}\` | Requested by ${(player.queue[i].requester as User).tag}\n`;
        }
        if (description.length >= 2048)  {
            embed.setDescription(first);
            break;
        }
    }
    if (!embed.description) embed.setDescription(description);
    embed.addField("Note", "If you have a ***really long*** queue, it might cut off due to how long it is. (don't worry, you'll be fine)");
    const component = new MessageActionRow()
        .addComponents(new MessageButton(
            {
                label: "Pause",
                style: "PRIMARY",
                customId: `pause_${context.guild!.id}`
            }
        ));
    await context.reply({ embeds: [embed], components: [component] });
});
