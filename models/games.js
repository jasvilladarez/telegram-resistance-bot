'use strict';
var async = require('async');
var Game = require('./game');
var Player = require('./player');

module.exports = function Games() {

	var games = [];

	this.addGame = function(groupId, userId, name) {
		var game = new Game(groupId);
		var player = new Player(userId, name);
		game.addPlayerObject(player);
		//FOR TESTING
		// game.addPlayerObject(new Player(userId, name));
		// game.addPlayerObject(new Player(userId, name));
		// game.addPlayerObject(new Player(userId, name));
		// game.addPlayerObject(new Player(userId, name));
		games.push(game);
	};

	this.getGames = function() {
		return games;
	};

	this.getGame = function(groupId, callback) {
		var selectedGame = null;
		async.each(games,
			function(game, callback) {
				if (game.groupId === groupId) {
					selectedGame = game;
				}
				callback();
			},
			function(err) {
				if (err) {
					callback(err);
				} else if (selectedGame) {
					callback(null, selectedGame);
				} else {
					callback();
				}
			});
	};

	this.addPlayer = function(game, userId, name, callback) {
		game.addPlayer(userId, name, callback);
	}

	this.removeGame = function(game, callback) {
		var index = games.indexOf(game);
		if (index > -1) {
			games.splice(index, 1);
		}
		callback();
	}
};