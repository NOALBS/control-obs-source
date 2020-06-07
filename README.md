# control-obs-source

Control OBS sources or have a source show up for a certain amount of time. 

## Build Prerequisities

- [Git](http://git-scm.com/)
- [Node.js](http://nodejs.org/) (with NPM)

>This script uses OBS plugin "obs-websocket"
- [OBS-WEBSOCKET](https://github.com/Palakis/obs-websocket/)

## Installation

- `git clone <repository-url>`
- Change into the new directory.
- `npm install`
- `npm run build`

## Config

Edit `config.json` to your own settings.

-   Use https://twitchapps.com/tmi to get your oauth from Twitch for use with chat commands.
    > We recommend using your main Twitch BOT account for this, but if you do not have a Twitch Bot account just use your Main Twitch Account.
    
To add a new command just add:

`{ "command": "YOUR CHAT COMMAND NAME", "source": "YOUR OBS SOURCE NAME", "duration": 30, "cooldown": 120 },`
> time in seconds

## Commands

There's only one command besides your own commands: `!source sourcename` (to toggle on/off a source)

## How to run

Run the app by running: `npm start`.
