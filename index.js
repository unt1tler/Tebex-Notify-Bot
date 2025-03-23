const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js")
const fastify = require("fastify")({ logger: false })
require("dotenv").config()


const client = new Client({
  intents: [GatewayIntentBits.Guilds],
})


let privateChannel = null
let publicChannel = null


const privateEmbedTemplate = new EmbedBuilder()
  .setTitle("🔒 New Purchase (Private Details)")
  .setColor(0x5865f2)
  .setFooter({ text: "Tebex Purchase Tracker - Private Channel" })

const publicEmbedTemplate = new EmbedBuilder()
  .setTitle("🛒 New Purchase!")
  .setColor(0x00ff00)
  .setFooter({ text: "Tebex Purchase Tracker" })


function createPrivateEmbed(payment) {
  return privateEmbedTemplate
    .setFields([
      { name: "Transaction ID", value: payment.id.toString(), inline: false },
      { name: "Amount", value: `${payment.amount} ${payment.currency.iso_4217}`, inline: true },
      { name: "Status", value: payment.status, inline: true },
      { name: "Date", value: new Date(payment.date).toLocaleString(), inline: true },
      { name: "Buyer", value: payment.player.name || "Unknown", inline: true },
      { name: "Email", value: payment.player.email || "Unknown", inline: true },
      payment.packages?.length > 0 && {
        name: "Purchased Resources",
        value: payment.packages
          .map((pkg) => `${pkg.name} (${pkg.quantity}x) - ${pkg.price} ${payment.currency.iso_4217}`)
          .join("\n"),
        inline: false,
      },
    ].filter(Boolean))
    .setTimestamp()
}


function createPublicEmbed(payment) {
  return publicEmbedTemplate
    .setFields([
      { name: "Date", value: new Date(payment.date).toLocaleString(), inline: true },
      { name: "Buyer", value: payment.player.name || "Anonymous", inline: true },
      payment.packages?.length > 0 && {
        name: "Purchased Resources",
        value: payment.packages.map((pkg) => `${pkg.name} (${pkg.quantity}x)`).join("\n"),
        inline: false,
      },
    ].filter(Boolean))
    .setTimestamp()
}


fastify.post("/webhook/tebex", {
  schema: {
    body: {
      type: "object",
      required: ["id", "amount", "currency", "date", "player", "packages"],
      properties: {
        id: { type: "number" },
        amount: { type: "number" },
        currency: {
          type: "object",
          required: ["iso_4217"],
          properties: {
            iso_4217: { type: "string" },
          },
        },
        date: { type: "string" },
        player: {
          type: "object",
          required: ["name"],
          properties: {
            name: { type: "string" },
            email: { type: "string" },
          },
        },
        packages: {
          type: "array",
          items: {
            type: "object",
            required: ["name", "quantity"],
            properties: {
              name: { type: "string" },
              quantity: { type: "number" },
              price: { type: "number" },
            },
          },
        },
      },
    },
  },
}, async (request, reply) => {
  const payment = request.body

  try {
    
    await Promise.all([
      privateChannel && privateChannel.send({ embeds: [createPrivateEmbed(payment)] }),
      publicChannel && publicChannel.send({ embeds: [createPublicEmbed(payment)] }),
    ])

    return { status: "success" }
  } catch (error) {
    console.error("Error sending notifications:", error)
    throw new Error("Failed to send notifications")
  }
})


client.once("ready", async () => {
  console.log(`Logged in as ${client.user.tag}!`)


  privateChannel = client.channels.cache.get(process.env.DISCORD_PRIVATE_CHANNEL_ID)
  publicChannel = client.channels.cache.get(process.env.DISCORD_PUBLIC_CHANNEL_ID)

  if (!privateChannel && !publicChannel) {
    console.error("No valid channels found! Please check your channel IDs.")
    process.exit(1)
  }

  
  try {
    const PORT = process.env.PORT || 3000
    await fastify.listen({ port: PORT, host: "0.0.0.0" })
    console.log(`Webhook server listening on port ${PORT}`)
  } catch (err) {
    console.error("Failed to start server:", err)
    process.exit(1)
  }
})

// Login to Discord
client.login(process.env.DISCORD_BOT_TOKEN)