const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const express = require('express');

const app = express();
app.use(express.json());

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

const TOKEN = process.env.DISCORD_TOKEN;
const LOG_CHANNEL_ID = process.env.LOG_CHANNEL_ID;
const PORT = process.env.PORT || 3000;

client.once('ready', () => {
    console.log(`Bot connecté : ${client.user.tag}`);
});

// Route appelée depuis le script Roblox
app.post('/keylog', async (req, res) => {
    try {
        const { username, userId, script, game, jobId, key } = req.body;

        const channel = await client.channels.fetch(LOG_CHANNEL_ID);
        if (!channel) return res.status(404).json({ error: 'Channel not found' });

        const embed = new EmbedBuilder()
            .setTitle('🔑 New Key Validated')
            .setColor(0x16a34a)
            .setThumbnail(`https://www.roblox.com/headshot-thumbnail/image?userId=${userId}&width=150&height=150&format=png`)
            .addFields(
                { name: '👤 Player',  value: username,  inline: true },
                { name: '🆔 UserId',  value: String(userId), inline: true },
                { name: '🎮 Script',  value: script,    inline: false },
                { name: '🌱 Game',    value: game,      inline: true },
                { name: '🔗 Job ID', value: jobId,      inline: false },
                { name: '🔑 Key',    value: `\`${key}\``, inline: false },
                { name: '⏰ Time',   value: new Date().toLocaleString('fr-FR'), inline: false },
            )
            .setFooter({ text: 'GD Studio — Key Logger' })
            .setTimestamp();

        await channel.send({ embeds: [embed] });
        res.json({ success: true });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

app.get('/', (req, res) => res.send('GD Studio Bot is running!'));

client.login(TOKEN).then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
