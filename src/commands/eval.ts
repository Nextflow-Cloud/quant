import { ApplicationCommandOptionTypes } from "discord.js/typings/enums";
import Command from "../structures/Command";
import { owners } from "../constants";

export default new Command("eval", {
    name: "eval",
    description: "[Owner] Evaluates code",
    options: [{
        name: "code",
        description: "The code to evaluate",
        type: ApplicationCommandOptionTypes.STRING,
        required: true
    }]
}, async (client, context) => {
    if (!owners.includes(context.user.id)) return context.reply("You are not allowed to use this command.");
    const code = context.options.data[0].value as string;
    try {
        const result = eval(code);
        context.reply(result);
    } catch (e) {
        context.reply((e as Error).message);
    }
});
