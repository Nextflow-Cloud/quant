import { ApplicationCommandOptionTypes } from "discord.js/typings/enums";
import Command from "../structures/Command";
import { AudioPlayerStatus, createAudioPlayer, createAudioResource, joinVoiceChannel } from "@discordjs/voice";
import { StageChannel } from "discord.js";

export default new Command("play_file", {
    name: "play_file",
    description: "Plays an audio file.",
    options: [{
        name: "file",
        description: "The audio file to play",
        type: ApplicationCommandOptionTypes.ATTACHMENT,
        required: true
    }]
}, async (client, context) => {
    if (context.guild!.me!.voice.channel) return context.reply("Music is already playing. Please wait for it to finish playing before trying again.");
    const userChannel = await context.guild!.members.fetch(context.user.id).then(member => member.voice.channel);
    if (!userChannel) return context.reply("You are not in a voice channel.");
    if (userChannel instanceof StageChannel) return context.reply("You cannot play audio in a stage channel."); // Stage channels are not supported.
    const resource = createAudioResource(context.options.data[0].attachment!.url);
    const player = createAudioPlayer()
        .on(AudioPlayerStatus.Idle, oldState => {
            if (oldState.status !== AudioPlayerStatus.Idle) {
                context.channel!.send(`Finished playing ${context.options.data[0].attachment!.name}`);
                connection.destroy();
            }
        })
        .on(AudioPlayerStatus.Playing, () => {
            resource.encoder?.setBitrate(userChannel.bitrate);
        });
    const connection = joinVoiceChannel({
        channelId: userChannel.id,
        guildId: context.guild!.id,
        // @ts-expect-error API types are not up to date
        adapterCreator: context.guild!.voiceAdapterCreator
    });
    connection.subscribe(player);
    player.play(resource);
    context.reply(`Now playing ${context.options.data[0].attachment!.name}`);
});
