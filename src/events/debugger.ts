import Event from "../structures/Event";

export default new Event("debug", (client, message) => {
    client.debug(message);
});
