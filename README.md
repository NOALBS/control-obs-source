# control-obs-source-bot

example config:
```
{
    "obs": {
        "ip": "localhost:4444",
        "password": "<obs-websocket-password>"
    },
    "twitchChat": {
        "channel": "<channel-name>",
        "botUsername": "<bot-name>",
        "oauth": "<bot-oauth>",
        "prefix": "!",
        "publicCommands": [
            "info-cmd, info-source, 30, 120",
            "car-cmd, car-source, 30, 120",
            "goal-cmd, goal-source, 30, 120",
            "plans-cmd, plans-source, 30, 120"
        ]
    }
}
```
