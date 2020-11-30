const Discord = require('discord.js');
const client = new Discord.Client({
  presence: {
    status: 'online',
    activity: {
        type: 'WATCHING',
        name: 'SlayBot\'s Statuspage',
    }
  },
});
const { token, webhookChannelID, webhookToken, developers } = require('./config.json');
const fs = require("fs");
const StatusPage = require("statuspage.io-listener");
const webhookClient = new Discord.WebhookClient(webhookChannelID, webhookToken);
const fetch = require('node-fetch');
const logger = require('./utils/logger');
const listener = new StatusPage.Listener("https://3h6r33zjscwy.statuspage.io/history.rss", readFunction, writeFunction)

client.on('ready', () => logger.log(`Logged in as ${client.user.tag}`, { color: 'green', tags: ['Discord'] }));
client.on('debug', (...args) => logger.log(...args, { color: 'green', tags: ['Debug'] }));

listener.on('newItem', async item => { 
  const body = await fetch('https://3h6r33zjscwy.statuspage.io/api/v2/status.json').then(res => res.json())

  console.log(item)
  const embed = new Discord.MessageEmbed()
    .setTitle(`<:warn:772527442664620043> ${item.title}`)
    .setURL(item.link)
    .setDescription(`${item.type} | \`${body.status.description}\`\n\n${item.description}`)


  if (item.description.startsWith('THIS IS A SCHEDULED EVENT')) return; // there is a bug with the package, so i disabled the maintenance.
  if (item.type === 'Investigating') embed.setColor('RED')
  if (item.type === 'Identified') embed.setColor('#e67e22')
  if (item.type === 'Monitoring') embed.setColor('#ffff00')
  if (item.type === 'Resolved') embed.setColor('GREEN')

  webhookClient.send({
    username: 'SlayBot',
    avatarURL: 'https://cdn.slaybot.xyz/assets/logos/slaybotlogo.png',
    embeds: [embed],
  })
})

client.on('message', async message => {
  const mentionRegex = RegExp(`^<@!?${client.user.id}>$`);
  const mentionRegexPrefix = RegExp(`^<@!?${client.user.id}>`);

  if (!message.guild || message.author.bot) return;

  const prefix = message.content.match(mentionRegexPrefix) ? 
  message.content.match(mentionRegexPrefix)[0] : 'm!';

  if (!message.content.startsWith(prefix)) return;

  if (message.content === prefix + "ping") {
    const msg = await message.channel.send('Pinging...');

    const latency = msg.createdTimestamp - message.createdTimestamp;

    msg.edit(`Time taken: ${latency}ms\nDiscord API: ${Math.round(client.ws.ping)}ms`);
  }

  if (message.content === prefix) {
    message.reply('i have 1 command, ping. what the fuck do you want now?')
  }
})
 
function readFunction() {
    return fs.readFileSync("./pubDate.txt", "utf8")
}
 
function writeFunction(pubDate) {
    fs.writeFileSync("./pubDate.txt", pubDate, "utf8")
}

client.login(token)