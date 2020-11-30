const Discord = require('discord.js');
const client = new Discord.Client();
const { token, webhookChannelID, webhookToken } = require('./config.json');
const fs = require("fs");
const StatusPage = require("statuspage.io-listener");
const webhookClient = new Discord.WebhookClient(webhookChannelID, webhookToken);
const fetch = require('node-fetch');

client.on('ready', () => {
  console.log('Mr. Slay is Ready')
});

let listener = new StatusPage.Listener("https://3h6r33zjscwy.statuspage.io/history.rss", readFunction, writeFunction)
 
listener.on('ready', () => { console.log("Statuspage Listener is Ready!") })
listener.on('error', error => { console.error(error) })

listener.on('newItem', async item => { 
  const body = await fetch('https://3h6r33zjscwy.statuspage.io/api/v2/status.json').then(res => res.json())

  console.log(item)
  const embed = new Discord.MessageEmbed()
    .setTitle(`<:warn:772527442664620043> ${item.title}`)
    .setURL(item.link)
    .setDescription(`${item.type} | \`${body.status.description}\`\n\n${item.description}`)

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
 
function readFunction() {
    return fs.readFileSync("./pubDate.txt", "utf8")
}
 
function writeFunction(pubDate) {
    fs.writeFileSync("./pubDate.txt", pubDate, "utf8")
}

client.login(token)