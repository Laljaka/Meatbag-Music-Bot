import { Client, Collection } from "discord.js";
import { MusicSubscription } from "../music/subscription";

export class MeatbagClient extends Client {
    public subscriptions: Collection<string, MusicSubscription>;
    public commands: Collection<string, any>;
    public oldCommands: Collection<string, any>;
    public prefixes: Collection<string, string>;

    public syncPreixes(): void;
}