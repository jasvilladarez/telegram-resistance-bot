'use strict';

module.exports = function Player(userId, username) {
	this.id = userId;
	this.name = username;
	this.character = -1;
	this.vote = 0;
}