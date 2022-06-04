import { MessageEmbed } from "discord.js";
import Command from "../structures/Command";

export default new Command("lyrics", {
    name: "lyrics",
    description: "Gets lyrics for a song",
    options: [{
        name: "song",
        type: "STRING",
        required: true,
        description: "The song to get lyrics for"
    }]
}, async (client, context) => {
    const lyrics = await client.lyrics.getLyrics(context.options.data[0].value as string);
    if (lyrics) {
        const stanzas = lyrics.lyrics.split("\n\n");
        let n = 0;
        let totalLength = 0;
        for (const stanza of stanzas) {
            totalLength += stanza.length;
            if (totalLength > 4096) {
                break;
            }
            n++;
        }
        const embed = new MessageEmbed()
            .setTitle(lyrics.title)
            .setDescription(stanzas.slice(0, n).join("\n\n"));
        if (n < stanzas.length) {
            embed.addField("\u200b", stanzas.slice(n).join("\n\n"));
        }
        await context.reply({ embeds: [embed] });
        // const embed = new MessageEmbed()
        //     .setTitle(`Lyrics for ${lyrics.title}`)
        //     .setDescription(lyrics.lyrics);
        // await context.reply({ embeds: [embed] });
    } else {
        await context.reply("No lyrics found.");
    }
});
