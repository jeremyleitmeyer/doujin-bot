const Client = require('node-rest-client').Client;
const client = new Client();

exports.help = function(bot, channelID){
  bot.sendMessage({
    to: channelID,
    message: '```!sauce - Use after an image has been posted for other sources of the image.\n !find <tag_name> - Gives you a random image with that tag name **NSFW**```',
  });
}

exports.play = function(bot, activity) {
  bot.setPresence({
    game: {
      name: activity
    }
  });
}

//this is the command for tag searching 

exports.find = function (bot, channelID, tag) {
  client.get('https://gelbooru.com/index.php?page=dapi&s=post&q=index&limit=50&tags=' + tag, function (data, response) {
    var iRes = data.posts.post
    if (iRes === undefined) {
      bot.sendMessage({
        to: channelID,
        message: '```No results found```',
      });
    } else {
      // set the highest random number to the amount of objs in the res
      var count = 0;
      for (i = 0; i < iRes.length; i++) {
        count = i
        var random = Math.floor(Math.random() * count)
      }
      var img = data.posts.post[random].$.file_url
      bot.sendMessage({
        to: channelID,
        message: img,
      });
    }
  })
  tag = ""
}

// this is the command for image searching

exports.sauce = function (bot, channelID, objData, lastMsg) {
  var api = 'http://saucenao.com/search.php?db=999&output_type=2&url=';
  var resultApi = 'http://saucenao.com/search.php?db=999&url=';

  // check for anything in the array
  if (lastMsg === undefined) {
    bot.sendMessage({
      to: channelID,
      message: '```Error, please send a link or upload an image before calling !sauce```',
    });
  } else {
    // calls API 
    client.get(api + objData[channelID], function (data, response) {
      var d = data.results
      var info, author, pic

      // in case !sauce is called without a link
      if (d === undefined) {
        bot.sendMessage({
          to: channelID,
          message: '```Error, message was not a URL.```',
        });
      } else {
        // all the api calls return different keys, this is how I decided to handle them
        if (d[0].data.eng_name === undefined || d[0].data.eng_name === '') {
          info = d[0].data.title
        } else {
          info = d[0].data.eng_name
        };

        if (d[0].header.thumbnail === undefined || d[0].header.thumbnail === '') {
          pic = 'https://blog.stylingandroid.com/wp-content/themes/lontano-pro/images/no-image-slide.png'
        } else {
          pic = d[0].header.thumbnail
        };

        if (d[0].data.creator === undefined || d[0].data.creator === '') {
          author = 'Unknown'
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
            description: ' \n' + 'Author: ' + author + '\n\n' + '[Saucenao.com Results](' + resultApi + lastMsg + ')'
          }
        });
      };
    });
  }
}