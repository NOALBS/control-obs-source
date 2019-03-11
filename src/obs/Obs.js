import ObsSocket from "./ObsSocket";

class Obs extends ObsSocket {
    async toggleSource(item, duration) {
        try {
            // Grab current scene name so we can turn it off even if the scene is changed.
            const { name, sources } = await this.obs.send("GetCurrentScene");
            const source = sources.find(source => source.name === item);

            if (source.render) {
                await this.obs.send("SetSceneItemProperties", { "scene-name": name, item, visible: false });
                this.emit("toggle", { item, visible: false });
            } else {
                this.obs.send("SetSceneItemProperties", { "scene-name": name, item, visible: true });
                this.emit("toggle", { item, visible: true });
            }

            if (!duration) return;

            setTimeout(() => {
                this.obs.send("SetSceneItemProperties", { "scene-name": name, item, visible: false });
            }, 1000 * duration);
        } catch ({ error }) {
            console.log("[OBS]", item, error);
        }
    }
}

export default Obs;
