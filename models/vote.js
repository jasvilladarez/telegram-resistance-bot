'use strict';

var Player = require('./player');

module.exports = function Vote() {
	var chosenPlayers = [];
	var result = 0;

	// this.getResult = function() {
	// 	var positiveCounter = 0;
	// 	var i = 0,
	// 		playerVotesLength = playerVotes.length;
	// 	for (i = 0; i < playerVotesLength; i++) {
	// 		if (playerVotes[i].vote === 1) {
	// 			positiveCounter++;
	// 		}
	// 	}
	// 	var negativeCounter = playerVotesLength - positiveCounter;
	// 	if (positiveCounter > negativeCounter) {
	// 		return 1;
	// 	} else if (positiveCounter < negativeCounter) {
	// 		return -1;
	// 	} else {
	// 		return 0;
	// 	}
	// }

	this.addChosenPlayer = function(player) {
		var chosenPlayer = getChosenPlayer(player);
		if (!chosenPlayer) {
			chosenPlayers.push(player);
		}
	}

	this.removeChosenPlayer = function(player) {
		var chosenPlayer = getChosenPlayer(player);
		if (chosenPlayer) {
			var index = chosenPlayer.indexOf(player);
			chosenPlayer.splice(index, 1);
		}
	}

	getChosenPlayer = function(player) {
		return chosenPlayers.find(function(chosenPlayer) {
			if (chosenPlayer.id !== player.id) {
				return chosenPlayer;
			}
		});
		return null;
	}

}