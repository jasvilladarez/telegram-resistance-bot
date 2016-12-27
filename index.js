'use strict';

const Telegram = require('telegram-node-bot');
const tg = new Telegram.Telegram(require('./key').key());
var GlobalController = require('./controllers/globalcontroller');
var GameController = require('./controllers/gamecontroller');

tg.router
	.when(['/newgame', '/join', '/players', '/startgame', '/stopgame'], new GameController(tg))
	.when(['/start', '/stop'], new GlobalController(tg));