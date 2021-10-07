const { MusicSubscription } = require('./subscription');
const { joinVoiceChannel } = require('@discordjs/voice');

const subscriptions = new Map();

async function play(string, channel) {
    let subscription = subscriptions.get(channel.guild.id);
    if (!subscription) {
        subscription = new MusicSubscription(
            joinVoiceChannel({
                channelId: channel.id,
                guildId: channel.guild.id,
                adapterCreator: channel.guild.voiceAdapterCreator,
            }),
        );
        subscriptions.set(channel.guild.id, subscription)
    }
    subscription.enqueue(string);
}

module.exports = {
    play
}