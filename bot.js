const Discord = require('discord.io');
const logger = require('winston');
const bodyParser = require('body-parser');
const reg = require('./regex-weburl.js');

// global
var msg, re_weburl;

// default Playing text
var activity = 'with sauce'

// variables for eventual api call
var lastMsg = '';
var objData = {};

//logger settings
logger.remove(logger.transports.Console);

logger.add(logger.transports.Console, {
	colorize: true
});

logger.level = 'debug';

var bot = new Discord.Client({
	token: process.env.BOT_TOKEN,
	autorun: true
});

bot.on('ready', function (evt) {
	logger.info('Connected');
	logger.info('Logged in as: ');
	logger.info(bot.username + ' - (' + bot.id + ')');
	bot.setPresence({
		game: {
			name: activity
		}
	});
});

// import commands file
const command = require('./command.js');

function isURL(msg) {
	if (reg.re_weburl.test(msg) === false) {
		return false
	} else {
		// clear and push single URL into lastMessage
		lastMsg = msg
		return true
	};
}

function setID(channelID) {
	if (isURL(msg)) {
		objData[channelID] = lastMsg
	}
}

bot.on('message', function (user, userID, channelID, message, evt) {

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
	};
	// will listen for messages that will start with `!`
	if (message.substring(0, 1) == '!') {
		var args = message.substring(1).split(' ');
		var cmd = args[0];
		var tag = args[1]

		args = args.splice(1);
		switch (cmd) {
			//commands
			case 'sauce':
				console.log(objData)
				setID(channelID)
				command.sauce(bot, channelID, objData, lastMsg)
				break;
				// a small tag based image search
			case 'find':
				command.find(bot, channelID, tag)
				break;
			case 'help':
				command.help(bot, channelID)
				break;
			case 'play':
				command.play(bot, activity)
				break;
		}
	};
})