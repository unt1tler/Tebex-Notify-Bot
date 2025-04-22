# Tebex Discord Bot

A Discord bot that sends real-time purchase notifications from Tebex to your Discord server. It supports both public and private channels with different levels of detail in the notifications.

## Features

- 🚀 Real-time purchase notifications via webhooks
- 🔒 Private channel notifications with complete purchase details
- 📢 Public channel notifications with limited purchase information
- 🛡️ Secure webhook endpoint for Tebex integration
- ⚡ Instant notifications without polling

## Prerequisites

- Node.js 16.x or higher
- A Discord bot token
- A Tebex store
- A server with a public URL to host the bot

## Setup

1. **Clone the repository**
   ```bash
   git clone (https://github.com/unt1tler/Tebex-Notify-Bot.git)
   cd tebex-discord-bot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit the `.env` file and fill in the following values:
   - `DISCORD_BOT_TOKEN`: Your Discord bot token
   - `DISCORD_PRIVATE_CHANNEL_ID`: Channel ID for detailed notifications
   - `DISCORD_PUBLIC_CHANNEL_ID`: Channel ID for public notifications
   - `PORT`: Port for the webhook server (default: 3000)

4. **Discord Bot Setup**
   - Go to [Discord Developer Portal](https://discord.com/developers/applications)
   - Create a new application
   - Add a bot to your application
   - Enable necessary intents (Server Members Intent)
   - Copy the bot token to your `.env` file
   - Invite the bot to your server using the OAuth2 URL generator

5. **Tebex Webhook Setup**
   - Log in to your Tebex dashboard
   - Go to Settings > Webhooks
   - Add a new webhook
   - Set the webhook URL to `https://your-server.com/webhook/tebex`
   - Save the webhook configuration

## Running the Bot

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

## Notification Format

### Private Channel
Detailed notifications include:
- Transaction ID
- Purchase amount and currency
- Payment status
- Purchase date
- Buyer information (name and email)
- Complete package details with prices

### Public Channel
Limited notifications include:
- Purchase date
- Buyer name (anonymized)
- Package names and quantities (without prices)

## Security Considerations

- Keep your `.env` file secure and never commit it to version control
- Host the bot on a secure server with HTTPS enabled
- Regularly rotate your Discord bot token
- Monitor the webhook endpoint for unusual activity

## Troubleshooting

1. **Bot not sending messages**
   - Verify the channel IDs in your `.env` file
   - Ensure the bot has permission to send messages in the channels
   - Check if the bot token is valid

2. **Webhook not receiving notifications**
   - Verify your server is accessible from the internet
   - Check if the webhook URL is correctly configured in Tebex
   - Ensure your server's firewall allows incoming connections

3. **Missing purchase information**
   - Verify the webhook payload format from Tebex
   - Check the server logs for any parsing errors

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
