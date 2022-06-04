import { MessageEmbed } from "discord.js";
import Command from "../structures/Command";
import { formatTime } from "../utilities";

export default new Command("play", {
    name: "play",
    description: "Plays a track from YouTube.",
    // cooldown: 5000,
    // aliases: [],
    // permissions: "EVERYONE",
    options: [{
        name: "track",
        description: "The track to play",
        type: "STRING",
        required: true
    }]
}, async (client, context) => {
    const member = await context.guild?.members.fetch(context.user.id);
    if (!member!.voice.channel) return await context.reply("Please connect to a voice channel! :frowning:");
    if (context.guild!.me!.voice.channel) {
        if (context.guild!.me!.voice.channel !== member!.voice.channel) {
            return await context.reply("I am not in the same voice channel as you! Please connect to the voice channel that I am in. :frowning:");
        }
    } else {
        const permissions = member!.voice.channel.permissionsFor(client.user!);
        if (!permissions!.has("CONNECT")) return await context.reply("I do not have permissions to connect! :frowning:");
        if (!permissions!.has("SPEAK")) return await context.reply("I do not have permissions to speak. :frowning:");
    }
    const player = client.manager.create({
        guild: context.guild!.id,
        textChannel: context.channel!.id,
        voiceChannel: member!.voice.channelId!
    });
    const track = context.options.data[0].value as string;
    if (track.includes(";")) {
        var items = track.split(";");
        if (items.length > 10) return await context.reply("To prevent spam, we limit mass queues to 10 per command.");
        await context.deferReply();
        var duration = 0;
        for (var i = 0; i < items.length; i++) {
            var res = await client.manager.search(items[i], context.user);
            if (res.loadType === "TRACK_LOADED" || res.loadType === "SEARCH_RESULT") {
                player.queue.add(res.tracks[0]);
                duration += res.tracks[0].duration;
                if (!player.playing && !player.paused && !player.queue.length) {
                    player.connect();
                    await player.play();
                }
            }
            if (res.loadType === "PLAYLIST_LOADED") {
                // await new Promise(resolve => setTimeout(resolve, 1000));
                res.tracks.forEach(track => player.queue.add(track));
                duration += res.tracks.reduce((acc, cur) => (acc + cur.duration), 0);
                if (!player.playing && !player.paused && player.queue.length === res.tracks.length - 1) {
                    player.connect();
                    await player.play();
                }
            }
        }
        const embed = new MessageEmbed()
            .setTitle(`Enqueueing (bulk)`)
            .setDescription(`${items.length} items`)
            .addField("Duration", formatTime(duration, true));
        await context.followUp({ embeds: [embed] });
    } else {
        const res = await client.manager.search(track, context.user);
        if (res.loadType === "TRACK_LOADED" || res.loadType === "SEARCH_RESULT") {
            player.queue.add(res.tracks[0]);
            const embed = new MessageEmbed()
                .setTitle(`Enqueueing (track)`)
                .setDescription(`\`${res.tracks[0].title}\``)
                .addField("Duration", formatTime(res.tracks[0].duration, true));
            await context.reply({ embeds: [embed] });
            if (!player.playing && !player.paused && !player.queue.length) {
                player.connect();
                await player.play();
            }
        }
        if (res.loadType === "PLAYLIST_LOADED") {
            // await new Promise(resolve => setTimeout(resolve, 1000));
            res.tracks.map(track => player.queue.add(track));
            const duration = formatTime(res.tracks.reduce((acc, cur) => acc + cur.duration, 0), true);
            const embed = new MessageEmbed()
                .setTitle(`Enqueueing (playlist)`)
                .setDescription(`\`${res.playlist!.name}\``)
                .addField("Duration", duration);
            await context.reply({ embeds: [embed] });
            if (!player.playing && !player.paused && player.queue.length === res.tracks.length - 1) {
                player.connect();
                await player.play();
            }
        }
    }
});
