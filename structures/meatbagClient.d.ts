import { Client, Collection } from "discord.js";
import { MusicPlayer } from "../music/musicPlayer";


export class MeatbagClient extends Client {
    public commands: Collection<string, any>;
    public oldCommands: Collection<string, any>;
    public prefixes: Collection<string, string>;
    public readonly musicPlayer: MusicPlayer;

    public syncPrefixes(): void;
}