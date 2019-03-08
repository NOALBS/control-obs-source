import OBSWebSocket from "obs-websocket-js";
import EventEmitter from "events";

class ObsSocket extends EventEmitter {
    constructor(settings) {
        super();

        this.obs = new OBSWebSocket();
        this.address = settings.ip;
        this.password = settings.password;

        this.connect();

        console.log("[OBS] Connecting & authenticating");
    }

    connect() {
        this.obs.connect({ address: this.address, password: this.password }).catch(e => {
            // handle this somewhere else
        });

        this.obs.on("ConnectionClosed", this.onDisconnect.bind(this));
        this.obs.on("AuthenticationSuccess", this.onAuth.bind(this));
        this.obs.on("AuthenticationFailure", this.onAuthFail.bind(this));
        this.obs.on("error", this.error.bind(this));
    }

    onAuth() {
        console.log(`[OBS] Successfully connected`);
        this.emit("connected");
    }

    error(e) {
        console.log(e);
    }

    onDisconnect() {
        console.log("[OBS] Can't connect or lost connnection");
        this.emit("disconnected");

        clearInterval(this.interval);

        this.reconnect();
    }

    onAuthFail() {
        console.log("[OBS] Failed to authenticate");
    }

    reconnect() {
        console.log("[OBS] Trying to reconnect in 5 seconds");
        setTimeout(() => {
            this.connect();
        }, 5000);
    }

    async toggleSource(item, duration) {
        try {
            await this.obs.send("SetSceneItemProperties", { item, visible: true });

            setTimeout(() => {
                this.obs.send("SetSceneItemProperties", { item, visible: false });
            }, 1000 * duration);
        } catch ({ error }) {
            console.log("[OBS]", item, error);
        }
    }
}

export default ObsSocket;
