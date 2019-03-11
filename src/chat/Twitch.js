import Socket from "./TwitchSocket";

class Chat extends Socket {
    registerCommand(command) {
        this.availableCommands.push(command.command);
        this.commands[command.command] = command;
    }

    registerConfigCommands(commands) {
        for (const command of commands) {
            command.type = "config";
            this.registerCommand(command);
        }
    }

    handleCommands(command, args, username, message) {
        const getCommand = this.commands[command];
        const isowner = username == this.channel;
        const ismod = message.tags.mod == true;
        // console.log("isowner", isowner, "ismod", ismod);

        if (getCommand.usertype == "mod" && !isowner && !ismod) return;

        switch (getCommand.type) {
            case "command":
                this[getCommand.command](args);
                return;
            case "config":
                this.handleSource(command);
                return;
            default:
                console.log("this should never happen");
                break;
        }
    }

    source(args) {
        this.obs.toggleSource(args);
    }

    handleSource(name) {
        const command = this.commands[name];

        this.obs.toggleSource(command.source, command.duration);
        this.cooldown.push(command.command);

        setTimeout(() => {
            this.cooldown = this.cooldown.filter(item => item !== command.command);
        }, 1000 * command.cooldown);
    }

    onToggleSource(data) {
        this.say(`${data.item} turned ${data.visible ? "on" : "off"}`);
    }

    say(message) {
        this.ws.send(`PRIVMSG #${this.channel} :${message}`);
    }
}

export default Chat;
