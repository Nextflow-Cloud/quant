import { ClientEvents } from "discord.js";
import Client from "./Client";

class Event<K extends keyof ClientEvents> {
    name: keyof ClientEvents;
    callback: (client: Client, ...args: ClientEvents[K]) => void;
    constructor(name: K, callback: (client: Client, ...args: ClientEvents[K]) => void) {
        this.name = name;
        this.callback = callback;
    }
}

export default Event;
