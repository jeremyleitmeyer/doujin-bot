const Discord = require('discord.io')
const logger = require('winston')
const bodyParser = require('body-parser')
const reg = require('./regex-weburl.js')

// global
var msg, re_weburl

// default Playing text
var activity = 'with sauce'

// variables for eventual api call
var lastMsg = ''
var objData = {}

// logger settings
logger.remove(logger.transports.Console)

logger.add(logger.transports.Console, {
  colorize: true
})

logger.level = 'debug'

var bot = new Discord.Client({
  token: process.env.BOT_TOKEN,
  autorun: true
})

bot.on('ready', function (evt) {
  logger.info('Connected')
  logger.info('Logged in as: ')
  logger.info(bot.username + ' - (' + bot.id + ')')
  bot.setPresence({
    game: {
      name: activity
    }
  })
})

// import command files
const command = require('./command.js')

function isURL(msg) {
  if (reg.re_weburl.test(msg) === false) {
    return false
  } else {
    // clear and push single URL into lastMessage
    lastMsg = msg
    return true
  }
}

function setID(channelID) {
  if (isURL(msg)) {
    objData[channelID] = lastMsg
  }
}

bot.on('message', function (user, userID, channelID, message, evt) {
  // fun :P
  if (message === 'this bot sucks') {
    bot.sendMessage({
      to: channelID,
      message: 'You suck. :kissing_heart:'
    })
  }

  // decides whether the data is an upload or a URL message
  if (message === '' && evt.d.author.bot != true) {
    // if we get an upload, we look for the attachment URL
    msg = evt.d.attachments[0].url
    isURL(msg)
    setID(channelID)
  } else {
    // if not we take the message as normal
    msg = message
    isURL(msg)
    setID(channelID)
  }
  // will listen for messages that will start with `!`
  if (message.substring(0, 1) == '!') {
    var args = message.substring(1).split(' ')
    var cmd = args[0]
    var tag = args[1]
    // for playing command, gets whole message after !play
    var playText = []

    for (i = 1; i < args.length; i++) {
      playText.push(args[i])
    }

    args = args.splice(1)
    switch (cmd) {
      // commands
      case 'sauce':
        console.log(objData)
        setID(channelID)
        command.sauce(bot, channelID, objData, lastMsg)
        break
        // a small tag based image search
      case 'find':
        command.find(bot, channelID, tag)
        break
      case 'help':
        command.help(bot, channelID)
        break
      case 'play':
        activity = playText.join(' ')
        command.play(bot, activity, userID, channelID)
        break
      case 'kawaii':
        command.kawaii(bot, channelID)
        break
        // NSFW ******************************
      case 'lewd':
        command.lewd(bot, channelID)
        break
      case 'feet':
        command.feet(bot, channelID)
        break
      case 'legs':
        command.legs(bot, channelID)
        break
      case 'niisokkusu':
        command.niisokkusu(bot, channelID)
        break
      case 'pantsu':
        command.pantsu(bot, channelID)
        break
        // **************************************
      case 'th':
        bot.sendMessage({
          to: channelID,
          message: ':thinking:'
        })
        break
      case 'sh':
        bot.sendMessage({
          to: channelID,
          message: '¯' + '\\' + '_(ツ)_/¯'
        })
        break
    }
  }
})
