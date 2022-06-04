import Event from "../structures/Event";

export default new Event("ready", async client => {
    client.manager.init(client.user!.id);
    client.log("Bot is ready!");
});
