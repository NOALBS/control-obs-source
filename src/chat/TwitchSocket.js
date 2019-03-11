import WebSocket from "ws";
import EventEmitter from "events";

import parse from "./Parser";

class Socket extends EventEmitter {
    constructor(settings, obs) {
        super();

        this.username = settings.botUsername;
        this.password = settings.oauth;
        this.channel = settings.channel;
        this.prefix = settings.prefix;

        this.obs = obs;

        // let's just put the commands in here
        this.availableCommands = [];
        this.commands = {};
        this.cooldown = [];

        this.open();
        this.registerCommand({ command: "source", type: "command", usertype: "mod" });
        this.registerConfigCommands(settings.sourceCommands);

        this.obs.on("toggle", this.onToggleSource.bind(this));

        console.log("[TWITCH] Connecting to twitch");
    }

    keepAlive() {
        this.interval = setInterval(() => {
            this.ws.send("PING :tmi.twitch.tv\r\n");
        }, 2000);
    }

    open() {
        this.ws = new WebSocket("wss://irc-ws.chat.twitch.tv:443");

        this.ws.onopen = this.onOpen.bind(this);
        this.ws.onmessage = this.onMessage.bind(this);
        this.ws.onerror = this.onError.bind(this);
        this.ws.onclose = this.onClose.bind(this);
    }

    onOpen() {
        if (this.ws !== null && this.ws.readyState === 1) {
            console.log("[TWITCH] Successfully Connected");

            this.ws.send("CAP REQ :twitch.tv/tags twitch.tv/commands");
            this.ws.send(`PASS ${this.password}`);
            this.ws.send(`NICK ${this.username}`);
            this.ws.send(`JOIN #${this.channel}`);

            this.keepAlive();
            this.emit("connected");
        }
    }

    onClose() {
        console.log("[TWITCH] Disconnected from twitch server");
        clearInterval(this.interval);
        this.ws.removeAllListeners();
        this.reconnect();
    }

    close() {
        if (this.ws) {
            this.ws.close();
        }
    }

    reconnect() {
        console.log(`[TWITCH] Trying to reconnect in 5 seconds`);

        setTimeout(() => {
            console.log("[TWITCH] Reconnecting...");
            this.open();
        }, 5000);
    }

    onError(e) {
        console.error("[TWITCH]", new Error(e));
    }

    onMessage(message) {
        if (message !== null) {
            const removeCRLF = message.data.split("\r\n")[0];
            this.handleMessage(parse(removeCRLF));
        }
    }

    handleMessage(message) {
        const msg = message.params[1];

        switch (message.command) {
            case "PING":
                this.ws.send("PONG");
                break;
            case "PRIVMSG":
                if (msg[0] !== this.prefix) return;
                const username = message.prefix.split("!")[0];
                const command = msg.indexOf(" ") == -1 ? msg.slice(1) : msg.slice(1).substring(0, msg.indexOf(" ") - 1);
                const args = msg.substr(msg.indexOf(" ") + 1);

                if (
                    this.cooldown.includes(command) ||
                    !this.availableCommands.includes(command)
                    // || (!this.availableCommands.includes(command) && message.tags.mod == true) ||
                    // (!this.availableCommands.includes(command) && username === this.channel)
                )
                    return;

                this.handleCommands(command, args, username, message);
                break;
        }
    }
}

export default Socket;
