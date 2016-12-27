# Telegram Resistance Bot
A Resistance bot for Telegram. This is currently incomplete and I'm still unsure if I would still finish it.

# Usage
Add this to your telegram group. Create a key.js file with the following code:
```
'use strict';
module.exports.key = function() {
	return <KEY>;
}
```
where `KEY` is the one provided by `BotFather`

Run
```node index.js```

# Commands
* /newgame - to create a new game
* /startgame - to start a game
* /join - to join a game
* /stopgame - to stop a game
* /players - to check the list of players

# License
Copyright 2016 Jasmine Villadarez

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.