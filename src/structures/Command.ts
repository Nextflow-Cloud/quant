import { ChatInputApplicationCommandData, CommandInteraction } from "discord.js";
import Client from "./Client";

class Command {
    name: string;
    options: ChatInputApplicationCommandData;
    callback: (client: Client, context: CommandInteraction) => void;
    constructor(name: string, options: ChatInputApplicationCommandData, callback: (client: Client, context: CommandInteraction) => void) {
        this.name = name;
        this.options = options;
        this.callback = callback;
    }
}

export default Command;
