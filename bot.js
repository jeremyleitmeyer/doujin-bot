const Discord = require('discord.io');
const logger = require('winston');
const auth = require('./auth.json')
const bodyParser = require('body-parser');
const Client = require('node-rest-client').Client;
const client = new Client();

var lastMessage = []
var api = "http://saucenao.com/search.php?db=999&output_type=2&url="
var resultApi = "http://saucenao.com/search.php?db=999&url="
var msg;

function isURL(msg) {
	var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
		'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
		'((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
		'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
		'(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
		'(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
	if (pattern.test(msg) === false) {
		return false
	} else {
		lastMessage = []
		lastMessage.push(msg)
		return true
	}
}

//logger settings
logger.remove(logger.transports.Console);

logger.add(logger.transports.Console, {
	colorize: true
});

logger.level = 'debug';

var bot = new Discord.Client({
	token: auth.token,
	autorun: true
});

bot.on('ready', function (evt) {
	logger.info('Connected');
	logger.info('Logged in as: ');
	logger.info(bot.username + ' - (' + bot.id + ')');
	bot.setPresence({
		game: {
			name: 'noodz'
		}
	});
});

bot.on('message', function (user, userID, channelID, message, evt) {
	if(message === ""){
		msg = evt.d.attachments[0].url
		isURL(msg)
	}else {
		msg = message
		isURL(msg)
	}
	// will listen for messages that will start with `!`
	if (message.substring(0, 1) == '!') {
		var args = message.substring(1).split(' ');
		var cmd = args[0];

		args = args.splice(1);
		switch (cmd) {
			//commands
			case 'sauce':
				if (lastMessage[0] === undefined) {
					bot.sendMessage({
						to: channelID,
						message: 'Error, please send a link before calling !sauce or if you uploaded the photo, please copy the URL and try again.',
					});
				} else {
					client.get(api + lastMessage[0], function (data, response) {
						// console.log(data.results)
						var d = data.results
						var d, info, author, pic

						if (d === undefined) {
							bot.sendMessage({
								to: channelID,
								message: 'Error, message was not a URL.',
							});
						} else {

						if (d[0].data.eng_name === undefined || d[0].data.eng_name === "") {
							info = d[0].data.title
						} else {
							info = d[0].data.eng_name
						}

						if (d[0].header.thumbnail === undefined || d[0].header.thumbnail === "") {
							pic = "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg"
						} else {
							pic = d[0].header.thumbnail
						}

						if (d[0].data.creator === undefined || d[0].data.creator === "") {
							author = "Unknown"
						} else {
							author = d[0].data.creator[0]
						}

						bot.sendMessage({
							to: channelID,
							message: '-',
							embed: {
								color: 6826080,
								thumbnail: {
									url: pic,
									width: 200
								},
								title: info,
								description: " \n" + "Author: " + author + '\n\n' + '[Search Results](' + resultApi + lastMessage + ')'
							}
						});
						lastMessage = []
					};
				});
			}
				break;
		}
	}
});