import Event from "../structures/Event";
import { EncryptionManager } from "@nextium/common";
const encryption = new EncryptionManager(Buffer.from(""), "", "");

export default new Event("interactionCreate", (client, interaction) => {
    if (interaction.isCommand()) {
        const command = client.commands.get(interaction.commandName);
        if (!command) return interaction.reply("Command not found.");
        // if (command.cooldown) {
        //     const cooldown = client.cooldowns.get(command.name);
        //     if (cooldown) {
        //         if (cooldown.has(interaction.author.id)) {
        //             return interaction.reply("You can use this command again in " + cooldown.get(interaction.author.id) + " seconds.");
        //         }
        //     }
        // }
        try {
            command.callback(client, interaction);
        } catch (e) {
            const id = encryption.random(32);
            console.error(`[${interaction.commandName}] Error ID: ${id}`);
            interaction.reply("An error occurred while executing this command. Error ID: " + id);
        }
    } else
    if (interaction.isButton()) {
        const player = client.manager.players.get(interaction.guild?.id ?? ""); // ||
        if (player) player.pause(player.playing);
        interaction.deferUpdate();
        // interaction.followUp("hi");
    }
});
