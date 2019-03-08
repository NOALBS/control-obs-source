import Socket from "./TwitchSocket";

class Chat extends Socket {
    registerCommands(commands) {
        for (const command of commands) {
            this.availableCommands.push(command.command);
            this.commands[command.command] = command;
        }
    }

    handleSource(name) {
        const command = this.commands[name];

        this.obs.toggleSource(command.source, command.duration);
        this.cooldown.push(command.command);

        setTimeout(() => {
            this.cooldown = this.cooldown.filter(item => item !== command.command);
        }, 1000 * command.cooldown);
    }

    say(message) {
        this.ws.send(`PRIVMSG #${this.channel} :${message}`);
    }
}

export default Chat;
