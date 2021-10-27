import { MeatbagClient } from "./structures/meatbagClient";
// import { Interaction, Message } from "discord.js";

module 'discord.js' {
    export class MeatbagInteraction extends Interaction {
        public readonly client: MeatbagClient;
    }

    export class MeatbagMessage extends Message {
        public readonly client: MeatbagClient;
    }
}