'use strict';
var async = require('async');
var Player = require('./player');

const OPS = 0;
const SPY = 1;
const PLAYER_NUMBERS = [
	[2, 3, 2, 3, 3],
	[2, 3, 4, 3, 4],
	[2, 3, 3, 4, 4],
	[3, 4, 4, 5, 5],
	[3, 4, 4, 5, 5],
	[3, 4, 4, 5, 5]
]

module.exports = function Game(groupId) {

	this.groupId = groupId;
	var players = [];
	var rounds = [];
	var currentRound = 0;
	var currentLeader = 0;
	this.status = 0;

	this.addPlayer = function(userId, name, callback) {
		var selectedPlayer = null;
		async.each(players, function(player, callback) {
			if (player.id === userId) {
				selectedPlayer = player;
			}
			callback();
		}, function(err) {
			if (err) {
				callback(err);
			} else if (selectedPlayer) {
				callback(null, selectedPlayer);
			} else {
				var player = new Player(userId, name);
				players.push(player);
				callback();
			}
		});
	};

	this.addPlayerObject = function(player) {
		players.push(player);
	}

	this.getPlayer = function(userId, callback) {
		return this.players.find(function(player) {
			if (player.userId === userId) {
				return player;
			} else {
				return null;
			}
		});
	}

	this.assignCharacters = function() {

	};

	this.getPlayers = function() {
		return players;
	}

	this.getPlayersString = function(callback) {
		var playersString = '';
		async.each(players, function(player, callback) {
			playersString += player.name + '\n';
			callback();
		}, function(err) {
			if (err) {
				callback(err);
			} else {
				callback(null, playersString);
			}
		});
	};

	this.distributeCharacters = function(doneCallback) {
		var playersLength = players.length;
		var maxSpies = Math.ceil(playersLength * 0.3);
		console.log('max ' + maxSpies);
		var spies = [];
		var resistance = [];
		var spiesString = '';

		for (var i = 0; i < maxSpies; i++) {
			var random = Math.floor((Math.random() * playersLength));
			players[random].character = SPY;
			spiesString += players[random].name;
			if(i < maxSpies - 1) {
				spiesString += ', ';
			}
			spies.push(players[random]);
		}
		async.each(players, function(player, callback) {
			if (player.character !== SPY) {
				player.character = OPS;
				resistance.push(player);
			}
				console.log(player.name + ' ' + player.character);
			callback();
		}, function(err) {
			if (err) {
				doneCallback(err);
			} else {
				doneCallback(null, resistance, spies, spiesString);
			}
		})
	};

	this.newLeader = function(minplayers, callback) {
		if(currentLeader >= players.length) {
			currentLeader = 0;
		}
		callback(players[currentLeader], currentRound + 1,
			PLAYER_NUMBERS[players.length - minplayers][currentRound]);
		currentLeader++;
	};

};