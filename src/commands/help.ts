import { ApplicationCommandOptionTypes } from "discord.js/typings/enums";
import Command from "../structures/Command";

export default new Command("help", {
    name: "help",
    description: "Get help",
    options: [{
        name: "command",
        description: "The command to get help for",
        type: ApplicationCommandOptionTypes.STRING,
        required: false
    }]
}, async (client, context) => {
    const command = context.options.data[0]?.value as string | undefined;
    if (command) {
        const cmd = client.commands.get(command);
        if (!cmd) return context.reply(`Command \`${command}\` not found.`);
        return context.reply(`**${cmd.name}** - ${cmd.options.description}`);
    } else {
        const commands = Array.from(client.commands.values()).map(c => `**${c.name}** - ${c.options.description}`);
        return context.reply(`Available commands:\n${commands.join("\n")}`);
    }
});
