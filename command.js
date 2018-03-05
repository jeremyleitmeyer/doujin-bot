const Client = require('node-rest-client').Client
const client = new Client()
// this is a test
var d = new Date()
var seconds = Math.round(d.getTime() / 1000)

exports.help = function (bot, channelID) {
  bot.sendMessage({
    to: channelID,
    message: '```!sauce - Use after an image has been posted for other sources of the image.'+
    '\n\n!lewd, !kawaii, !feet, !legs, !pantsu, and !niisokkusu will give you a random image from a respective subreddit.' +
    '\n\n!find <tag_name> - Gives you a random image with that tag name **NSFW**'+
    '\n\n!play sets the Playing status(admin only)```'
  })
}

exports.play = function (bot, activity, userID, channelID) {
  if (userID === process.env.ADMIN) {
    // temp fix
    bot.setPresence({
      game: {
        name: activity
      }
    })
  } else {
    bot.sendMessage({
      to: channelID,
      message: '```You do not have that permission```'
    })
  }
}

// this is the command for tag searching 

exports.find = function (bot, channelID, tag) {
  client.get('https://gelbooru.com/index.php?page=dapi&s=post&q=index&limit=50&tags=' + tag, function (data, response) {
if (data === undefined || data.post === undefined || data.posts.post === undefined) {
      bot.sendMessage({
        to: channelID,
        message: '```No results found```'
      })
    } else {
      // set the highest random number to the amount of objs in the res
      var count = 0
      for (i = 0; i < data.posts.post.length; i++) {
        count = i
        var random = Math.floor(Math.random() * count)
      }
      var img = data.posts.post[random].$.file_url
      bot.sendMessage({
        to: channelID,
        message: img
      })
    }
  })
  tag = ''
}

// this is the command for image searching

exports.sauce = function (bot, channelID, objData, lastMsg) {
  var api = 'http://saucenao.com/search.php?db=999&output_type=2&url='
  var resultApi = 'http://saucenao.com/search.php?db=999&url='

  // check for anything in the array
  if (lastMsg === undefined) {
    bot.sendMessage({
      to: channelID,
      message: '```Error, please send a link or upload an image before calling !sauce```'
    })
  } else {
    // calls API 
    client.get(api + objData[channelID], function (data, response) {
      var d = data.results
      var info, author, pic

      // in case !sauce is called without a link
      if (d === undefined) {
        bot.sendMessage({
          to: channelID,
          message: '```Error, message was not a URL.```'
        })
      } else {
        // all the api calls return different keys, this is how I decided to handle them
        if (d[0].data.eng_name === undefined || d[0].data.eng_name === '') {
          info = d[0].data.title
        } else {
          info = d[0].data.eng_name
        }

        if (d[0].header.thumbnail === undefined || d[0].header.thumbnail === '') {
          pic = 'https://blog.stylingandroid.com/wp-content/themes/lontano-pro/images/no-image-slide.png'
        } else {
          pic = d[0].header.thumbnail
        }

        if (d[0].data.creator === undefined || d[0].data.creator === '') {
          author = 'Unknown'
        } else {
          author = d[0].data.creator
        }

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
        })
      }
    })
  }
}

// redditbooru commands
// besides kawaii, these are NSFW commands. 

exports.lewd = function (bot, channelID) {
  var thing = seconds - (Math.random() * 1000000)
  var n = 'https://ecchi.redditbooru.com/api/images/?limit=100&nsfw=true&afterDate=' + Math.round(thing)
  client.get(n, function (data, response) {
    // parsed response body as js object
    var nsfw = data[Math.floor(Math.random() * 100)].cdnUrl

    bot.sendMessage({
      to: channelID,
      message: nsfw
    })
  })
}

exports.kawaii = function (bot, channelID) {
  var thing = seconds - (Math.random() * 1000000)
  var k = 'https://awwnime.redditbooru.com/api/images/?limit=100&nsfw=false&afterDate=' + Math.round(thing)
  client.get(k, function (data, response) {
    var kawaii = data[Math.floor(Math.random() * 100)].cdnUrl
    bot.sendMessage({
      to: channelID,
      message: kawaii
    })
  })
}

exports.feet = function (bot, channelID) {
  var thing = seconds - (Math.random() * 1000000)
  var n = 'https://animefeet.redditbooru.com/api/images/?limit=100&nsfw=true&afterDate=' + Math.round(thing)
  client.get(n, function (data, response) {
    // parsed response body as js object
    feet = data[Math.floor(Math.random() * 100)].cdnUrl

    bot.sendMessage({
      to: channelID,
      message: feet
    })
  })
}

exports.legs = function (bot, channelID) {
  var thing = seconds - (Math.random() * 1000000)
  var k = 'https://animelegs.redditbooru.com/api/images/?limit=100&nsfw=false&afterDate=' + Math.round(thing)
  client.get(k, function (data, response) {
    var legs = data[Math.floor(Math.random() * 100)].cdnUrl
    bot.sendMessage({
      to: channelID,
      message: legs
    })
  })
}

exports.niisokkusu = function (bot, channelID) {
  var thing = seconds - (Math.random() * 1000000)
  var k = 'https://animelegwear.redditbooru.com/api/images/?limit=100&nsfw=false&afterDate=' + Math.round(thing)
  client.get(k, function (data, response) {
    var niisokkusu = data[Math.floor(Math.random() * 100)].cdnUrl
    bot.sendMessage({
      to: channelID,
      message: niisokkusu
    })
  })
}

exports.pantsu = function (bot, channelID) {
  var thing = seconds - (Math.random() * 1000000)
  var k = 'https://pantsu.redditbooru.com/api/images/?limit=100&nsfw=false&afterDate=' + Math.round(thing)
  client.get(k, function (data, response) {
    var pantsu = data[Math.floor(Math.random() * 100)].cdnUrl
    bot.sendMessage({
      to: channelID,
      message: pantsu
    })
  })
}
