const mongoose = require('mongoose')
const Player = require('./models/Player')
const self = require('./points.js')
var points, currentUser

exports.new = function (bot, evt, channelID, userID) {
  console.log(userID)
  var currentPlayer = Player.findOne({
    playerId: userID
  }, function (err, player) {
    console.log(player)
    if (player === null) {
      console.log(player)
      var newPlayer = new Player({
        name: evt.d.author.username,
        playerId: userID,
        points: 10
      }).save()
      currentPlayer = Player.find({
        playerId: userID
      }, function (err, player) {
        console.log(player)
        bot.sendMessage({
          to: channelID,
          message: '```You have been added !```'
        })
      })
    }
  })
}

exports.points = function (bot, evt, channelID, userID) {
  var currentPlayer = Player.findOne({
    playerId: userID
  }, function (err, player) {
    console.log(player)
    if (player === null) {
      self.new(bot, evt, channelID, userID)
      self.points(bot, evt, channelID, userID)
    }
    if (player.playerId === userID) {
      bot.sendMessage({
        to: channelID,
        message: '```' + player.name + ' has ' + player.points + ' points!' + '```'
      })
    }
  })
}

exports.addOne = function (userID) {
  console.log('add one')
  var currentPlayer = Player.findOne({
    playerId: userID
  }).update({$inc: {points: 1} }, function (err, doc) {
    console.log(err)
  })
}

exports.addTwo = function (userID) {
  console.log('add one')
  var currentPlayer = Player.findOne({
    playerId: userID
  }).update({$inc: {points: 2} }, function (err, doc) {
    console.log(err)
  })
}

exports.addThree = function (userID) {
  console.log('add one')
  var currentPlayer = Player.findOne({
    playerId: userID
  }).update({$inc: {points: 3} }, function (err, doc) {
    console.log(err)
  })
}
