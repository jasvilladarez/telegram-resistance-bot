'use strict';

var TelegramBaseController = require('telegram-node-bot').TelegramBaseController;


module.exports = class GlobalController extends TelegramBaseController {


	constructor(tg){
		super();
		this.tg = tg;
	}

	get routes() {
		return {
			'/start' : 'startHandler',
			'/stop' : 'stopHandler',
			'/startgame' : 'otherwiseHandler',
			'/stopgame':'otherwiseHandler'
		}
	}

	startHandler($) {
		$.sendMessage('Hi this is Resistance Bot. I\'m the moderator for the Resistance game. Add me in a group to begin playing.');
		console.log($);
	}

	stopHandler($) {
		this.tg.api.sendMessage($.message.from.id, 'Bye ' + $.message.from.firstName);
		console.log($);
	}

	otherwiseHandler($) {

	}
}