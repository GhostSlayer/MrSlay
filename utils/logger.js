const chalk = require('chalk')
const _ = require('lodash')
//const { WebhookClient } = require('discord.js')
//const webhookClient = new WebhookClient('', '');

module.exports = {
  /**
   * Adds a new log entry to the console.
   * @param {string} message - Log message
   * @param {Object} [options] - Options
   * @param {string[]} [options.tags] - Tags to identify the log entry
   * @param {boolean} [options.bold] - If message will be bold
   * @param {boolean} [options.italic] - If message will be italic
   * @param {boolean} [options.underline] - If message will be underline
   * @param {boolean} [options.reversed] - If message will be reversed
   * @param {'bgBlack'|'bgBlackBright'|'bgRed'|'bgRedBright'|'bgGreen'|'bgGreenBright'|'bgYellow'|'bgYellowBright'|'bgBlue'|'bgBlueBright'|'bgMagenta'|'bgMagentaBright'|'bgCyan'|'bgCyanBright'|'bgWhite'|'bgWhiteBright'} [options.bgColor] - Background color of message
   * @param {'black'|'blackBright'|'red'|'redBright'|'green'|'greenBright'|'yellow'|'yellowBright'|'blue'|'blueBright'|'magenta'|'magentaBright'|'cyan'|'cyanBright'|'white'|'whiteBright'} [options.color] - Color of message
  */
  log (
    message,
    {
      tags = [],
      bold = false,
      italic = false,
      underline = false,
      reversed = false,
      bgColor = false,
      color = 'white'
    } = {}
  ) {
    const colorFunction = _.get(
      chalk,
      [bold, italic, underline, reversed, bgColor, color].filter(Boolean).join('.')
    )

    console.log(...tags.map(t => chalk.cyan(`[${t}]`)), colorFunction(message))
    //webhook not required but if u want to use feel free to use it then lmfao
    //webhookClient.send(...tags.map(t => `[${t}] ${message}`))
  }
}