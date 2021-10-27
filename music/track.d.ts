import { AudioResource } from '@discordjs/voice';

export class Track {
    public constructor(url: string, title: string, thumbnail: string, duration: string);
    public url: string;
    public title: string;
    public thumbnail: string;
    public duration: string;

    public fetchMissingData(): Promise<void>;
    public createAudioResourceW(): Promise<AudioResource>;
}