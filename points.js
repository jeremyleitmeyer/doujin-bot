const mongoose = require('mongoose')
const Player = require('./models/Player')
const self = require('./points.js')
var points, some;

exports.new = function (bot, evt, channelID, userID) {

  var currentPlayer = Player.findOne({
    playerId: userID
  }, function (err, player) {

    if (player === null) {

      var newPlayer = new Player({
        name: evt.d.author.username,
        playerId: userID,
        points: 10
      }).save()
      currentPlayer = Player.find({
        playerId: userID
      }, function (err, player) {
 
        bot.sendMessage({
          to: channelID,
          message: '```You have been added !\nTry !points again !```'
        })
      })
    }
  })
}

exports.points = function (bot, evt, channelID, userID) {
  var currentPlayer = Player.findOne({
    playerId: userID
  }, function (err, player) {

    if (player === null) {
      self.new(bot, evt, channelID, userID)
    } else {
      if (player.playerId === userID) {
        bot.sendMessage({
          to: channelID,
          message: '```' + player.name + ' has ' + player.points + ' points!' + '```'
        })
      }
    }
  })
}

exports.addOne = function (userID) {
  var currentPlayer = Player.findOne({
    playerId: userID
  }).update({
    $inc: {
      points: 1
    }
  }, function (err, doc) {
    console.log(err)
  })
}

exports.addTwo = function (userID) {
  var currentPlayer = Player.findOne({
    playerId: userID
  }).update({
    $inc: {
      points: 2
    }
  }, function (err, doc) {
    console.log(err)
  })
}

exports.addThree = function (userID) {
  var currentPlayer = Player.findOne({
    playerId: userID
  }).update({
    $inc: {
      points: 3
    }
  }, function (err, doc) {
    console.log(err)
  })
}

exports.addSome = function (userID, some) {
  var currentPlayer = Player.findOne({
    playerId: userID
  }).update({
    $inc: {
      points: i
    }
  }, function (err, doc) {
    console.log(err)
  })
}
