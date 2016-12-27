'use strict';
var Telegram = require('telegram-node-bot')
var TelegramBaseController = Telegram.TelegramBaseController;
var GameWrapper = require('../models/games');

const MAXPLAYERS = 10;
const MINPLAYERS = 1;

module.exports = class GameController extends TelegramBaseController {

	constructor(tg) {
		super();
		this.tg = tg;
		this.gameWrapper = new GameWrapper();
	}

	get routes() {
		return {
			'/newgame': 'newGameHandler',
			'/join': 'joinHandler',
			'/players': 'listPlayerHandler',
			'/startgame': 'startGameHandler',
			'/stopgame': 'stopGameHandler'
		}
	}

	groupChecker($) {
		if ($.message.chat.type === 'group') {
			return true;
		} else {
			$.sendMessage('You must run this command in a group');
			return false;
		}
	}

	getPlayerName($) {
		var name = $.message.from.firstName;
		if ($.message.from.lastName !== null) {
			name += ' ' + $.message.from.lastName;
		}
		return name;
	}

	getGame($, groupId, callback) {
		this.gameWrapper.getGame(groupId, function(err, game) {
			if (err) {
				console.log(err);
			} else if (game) {
				callback(game);
			} else {
				$.sendMessage('There is no game currently in progress. ' +
					'Create game using the /newgame command.');
			}
		})
	}

	newGameHandler($) {
		if (this.groupChecker($)) {
			var groupId = $.message.chat.id;
			var wrapper = this.gameWrapper;
			var getPlayerName = this.getPlayerName;
			this.gameWrapper.getGame(groupId, function(err, game) {
				if (err) {
					console.log(err);
				} else if (game) {
					$.sendMessage('There is an ongoing game.');
				} else {
					wrapper.addGame(groupId, $.message.from.id, getPlayerName($));
					$.sendMessage('*' + $.message.from.firstName + '* just started a game.' +
						' Use the /join command to join the fun.', {
							'parse_mode': 'Markdown'
						});
				}
			});
		}
	}

	joinHandler($) {
		if (this.groupChecker($)) {
			var groupId = $.message.chat.id;
			var wrapper = this.gameWrapper;
			var getPlayerName = this.getPlayerName;
			this.getGame($, groupId, function(game) {
				if (game) {
					if (game.status === 0) {
						if (game.getPlayers().length < MAXPLAYERS) {
							wrapper.addPlayer(game, $.message.from.id, getPlayerName($),
								function(err, player) {
									if (err) {
										console.log(player);
									} else if (player) {
										$.sendMessage(player.name + ' already added in the game');
									} else {
										$.sendMessage('*' + $.message.from.firstName + '* just joined the game. *' +
											game.getPlayers().length + '* players, *5* minimum, *10* maximum.', {
												'parse_mode': 'Markdown'
											});
									}
								});
						} else {
							$.sendMessage('Max players reached');
						}
					} else {
						$.sendMessage('Game already started');
					}
				}
			});
		}
	}

	listPlayerHandler($) {
		if (this.groupChecker($)) {
			var groupId = $.message.chat.id;
			this.getGame($, groupId, function(game) {
				if (game) {
					var players = game.getPlayersString(function(err, players) {
						$.sendMessage(players);
					});
				}
			});
		}
	}

	startGameHandler($) {
		if (this.groupChecker($)) {
			var groupId = $.message.chat.id;
			var tg = this.tg;
			var newLeader = this.newLeader;
			var distributeCharacters = this.distributeCharacters;
			var sendPlayerDistribution = this.sendPlayerDistribution;
			this.getGame($, groupId, function(game) {
				if (game) {
					if (game.getPlayers().length >= MINPLAYERS) {
						if (game.status === 0) {
							game.status = 1;
							$.sendMessage('Starting game...');
							setTimeout(function() {
								game.distributeCharacters(function(err, resistance, spies, spiesString) {
									sendPlayerDistribution(tg, resistance, spies, spiesString);
								});
								newLeader($, game);
							}, 100);
						} else {
							$.sendMessage('Game already started');
						}
					} else {
						$.sendMessage('Minimum number of players not reached. Waiting for more players...');
					}
				}
			});
		}
	}

	sendPlayerDistribution(tg, resistance, spies, spiesString) {
		resistance.forEach(function(player, index, array) {
			tg.api.sendMessage(player.id, 'You are part of the resistance.');
		});
		spies.forEach(function(player, index, array) {
			tg.api.sendMessage(player.id, 'You are a spy. Other spies: ' + spiesString);
		});
	}

	newLeader($, game) {
		game.newLeader(MINPLAYERS,
			function(leader, currentRound, playerNumbers) {
				$.sendMessage('*' + leader.name + '* is the leader for this round (round #' + currentRound + ')\n' +
					leader.name + ', please choose * ' + playerNumbers +
					' * players to complete this round\'s mission. ', {
						'parse_mode': 'Markdown'
					});
			});
	}

	stopGameHandler($) {
		if (this.groupChecker($)) {
			var groupId = $.message.chat.id;
			var gameWrapper = this.gameWrapper;
			var tg = this.tg;
			this.getGame($, groupId, function(game) {
				if (game) {
					$.runInlineMenu({
						method: 'sendMessage',
						params: ['Are you sure you want to stop the ongoing game?'],
						menu: [{
							text: 'Yes',
							callback: (query, response) => {
								gameWrapper.removeGame(game, function(err) {
									if (err) {
										console.log(err);
									} else {
										$.runInlineMenu({
											message: 'Game stopped',
											menu: []
										}, response);
									}
								});
							}
						}, {
							text: 'No',
							callback: () => {
								$.runInlineMenu({
									message: 'Game stopped',
									menu: []
								}, response);
							}
						}]
					})
				}
			})
		}
	}
}