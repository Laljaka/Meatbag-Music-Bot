import { MusicSubscription } from "../music/subscription";
import { Collection, MeatbagInteraction, MeatbagMessage } from "discord.js";

export class MusicPlayer {
    public subscriptions: Collection<string, MusicSubscription>;
    public async play(interaction: MeatbagInteraction | MeatbagMessage, string: string): Promise<void>;
    public async run(track: any, interaction: MeatbagInteraction | MeatbagMessage): Promise<void>;
    public async skip(interaction: MeatbagInteraction | MeatbagMessage): Promise<void>;
    public async leave(interaction: MeatbagInteraction | MeatbagMessage): Promise<void>;
    public async queue(interaction: MeatbagInteraction | MeatbagMessage): Promise<void>;
    public async jump(interaction: MeatbagInteraction | MeatbagMessage, number: BigInt): Promise<void>;
    public async shuffleQueue(interaction: MeatbagInteraction | MeatbagMessage): Promise<void>;
    public async stop(interaction: MeatbagInteraction | MeatbagMessage): Promise<void>;
    public async loop(interaction: MeatbagInteraction | MeatbagMessage): Promise<void>;
    private replyBuilder(interaction: MeatbagInteraction | MeatbagMessage, content: string): {};
}