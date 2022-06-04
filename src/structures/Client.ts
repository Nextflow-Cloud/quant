import { Manager, ManagerOptions } from "@nextium/erela.js";
import { Client as DiscordClient, ClientOptions, MessageEmbed, TextChannel } from "discord.js";
import chalk from "chalk";
import { formatTime, resolveCommands, resolveEvents } from "../utilities";
import Command from "./Command";
import Lyrics from "./Lyrics";

class Client extends DiscordClient {
    commands: Map<string, Command> = new Map();
    manager: Manager;
    lyrics: Lyrics;
    constructor(options: ClientOptions & { ws?: { version?: number } }, musicOptions: ManagerOptions & { defaultSearchPlatform?: string }) {
        super(options);
        this.manager = new Manager(musicOptions);
        this.manager.on("nodeError", async (node, error) => this.error(error));
        this.manager.on("nodeConnect", async node => this.log("New node created."));
        this.manager.on("queueEnd", async player => {
            (this.channels.cache.get(player.textChannel!)! as TextChannel).send("Queue has ended.");
            player.destroy();
        });
        this.manager.on("trackStart", async (player, track) => {
            const embed = new MessageEmbed()
                .setTitle(`Now playing`)
                .setDescription(`\`${track.title}\``)
                .addField("Duration", formatTime(track.duration, true));
            (this.channels.cache.get(player.textChannel!)! as TextChannel).send({ embeds: [embed] });
        });
        this.manager.on("trackStuck", (p, t, l) => this.log(JSON.stringify(l)));
        this.manager.on("trackError", (p, t, l) => this.log(JSON.stringify(l)));
        this.manager.on("socketClosed", (p, l) => this.log(JSON.stringify(l)));
        this.on("raw", (packet) => this.manager.updateVoiceState(packet));
        this.lyrics = new Lyrics();
    }
    debug(content: unknown) {
        console.debug(chalk.gray(`[DEBUG] ${content}`));
    }
    log(content: unknown) {
        const s = `[${chalk.green("INFO")}] ${content}`;
        console.log(s);
    }
    warn(content: unknown) {
        const s = `[${chalk.yellow("WARN")}] ${content}`;
        console.warn(s);
    }
    error(error: Error) {
        console.error(chalk.red(`[ERROR] ${error.message}`));
    }
    async run(token: string, options: { guildId?: string; }) {
        const commands = await resolveCommands();
        for (const command of commands) {
            this.commands.set(command.name, command);
        }
        const events = await resolveEvents();
        for (const event of events) {
            this.on(event.name, event.callback.bind(null, this));
        }
        this.debug("Finished registering events.");
        await this.login(token);
        this.debug("Registering slash commands...");
        if (options.guildId) {
            await this.application?.commands.set(commands.map(c => c.options), options.guildId).catch(e => this.error(e));
        } else {
            await this.application?.commands.set(commands.map(c => c.options)).catch(e => this.error(e));
        }
        this.debug("Finished registering slash commands.");
    }
}

export default Client;
