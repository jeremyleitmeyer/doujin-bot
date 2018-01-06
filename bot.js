const Discord = require('discord.io');
const logger = require('winston');
const bodyParser = require('body-parser');
const Client = require('node-rest-client').Client;
const client = new Client();
const reg = require('./regex-weburl.js');
// variables for eventual api call
var lastMsg = "";
var objData = {};
var api = "http://saucenao.com/search.php?db=999&output_type=2&url=";
var resultApi = "http://saucenao.com/search.php?db=999&url=";
var msg, re_weburl;

// I did not create this. I found it from http://forums.devshed.com/javascript-development-115/regexp-match-url-pattern-493764.html
function isURL(msg) {
	if (reg.re_weburl.test(msg) === false) {
		return false
	} else {
		// clear and push single URL into lastMessage
		lastMsg = msg
		return true
	};
};

function setID(channelID) {
	if (isURL(msg)) {
		objData[channelID] = lastMsg
	}
}

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
			name: 'saucelord'
		}
	});
});

bot.on('message', function (user, userID, channelID, message, evt) {
	// decides whether the data is an upload or a URL message
	if (message === "" && userID != bot.id) {
		// if we get an upload, we look for the attachment URL
		msg = evt.d.attachments[0].url
		setID(channelID)
		isURL(msg)
	} else {
		// if not we take the message as normal
		msg = message
		setID(channelID)
		isURL(msg)
	};
	// will listen for messages that will start with `!`
	if (message.substring(0, 1) == '!') {
		var args = message.substring(1).split(' ');
		var cmd = args[0];

		args = args.splice(1);
		switch (cmd) {
			//commands
			case 'sauce':
			console.log(objData)
				// check for anything in the array
				if (lastMsg === undefined) {
					bot.sendMessage({
						to: channelID,
						message: 'Error, please send a link or upload an image before calling !sauce',
					});
				} else {
					// calls API 
					client.get(api + objData[channelID], function (data, response) {
						var d = data.results
						var d, info, author, pic
						// in case !sauce is called without a link
						if (d === undefined) {
							bot.sendMessage({
								to: channelID,
								message: 'Error, message was not a URL.',
							});
						} else {
							// all the api calls return different keys, this is how I decided to handle them
							if (d[0].data.eng_name === undefined || d[0].data.eng_name === "") {
								info = d[0].data.title
							} else {
								info = d[0].data.eng_name
							};

							if (d[0].header.thumbnail === undefined || d[0].header.thumbnail === "") {
								pic = "https://blog.stylingandroid.com/wp-content/themes/lontano-pro/images/no-image-slide.png"
							} else {
								pic = d[0].header.thumbnail
							};

							if (d[0].data.creator === undefined || d[0].data.creator === "") {
								author = "Unknown"
							} else {
								author = d[0].data.creator
							};

							// sends the embed message with the info
							bot.sendMessage({
								to: channelID,
								message: '',
								embed: {
									color: 6826080,
									thumbnail: {
										url: pic,
										width: 200
									},
									title: info,
									description: " \n" + "Author: " + author + '\n\n' + '[Saucenao.com Results](' + resultApi + lastMsg + ')'
								}
							});
						};
					});
				}
				break;
		}
	}
});