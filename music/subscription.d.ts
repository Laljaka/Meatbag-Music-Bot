import { VoiceConnection, AudioPlayer } from '@discordjs/voice';
// import { Client } from 'discord.js';
import { MeatbagClient } from '../structures/meatbagClient';
import { Track } from './track';

export class MusicSubscription {
    public constructor(voiceConnection: VoiceConnection, channelId: string, guildId: string, client: MeatbagClient);
    public voiceConnection : VoiceConnection;
    public audioPlayer: AudioPlayer;
    public queue: Track[];
    public isPlaying: boolean;
    public queueLock: boolean;
    public readyLock: boolean;
    public channelLock: string;
    public readonly client: MeatbagClient;
    public currentlyPlaying: Track;
    public guildId: string;
    public timeout: NodeJS.Timeout;
    public retry: number;

    public async enqueue(track: Track): Promise<void>; 
}