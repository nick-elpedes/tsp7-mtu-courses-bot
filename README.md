# tsp7-mtu-courses-bot
## Setup
Pull the repository and create a `.env` file.

Insert YOUR bot token and client id into the file, unless running prod. (Don't want to run multiple instances of the bot on the same token)
Insert the mongodb URI of the mongo server the bot will use.
### Setup and Sync MongoDB
Run the `sync.js` file to sync the MTU Courses Database to your mongo database. (This syncs a lot of data, so please be gentle or the API may get mad)
This also takes a few minutes.

### Sync Avaliable Commands
Run the `register-commands.js` file to sync the slash commands with Discord.

### Start the Bot
Run the `start.js` file or use `npm run start` to start the bot.
