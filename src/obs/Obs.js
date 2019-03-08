import ObsSocket from "./ObsSocket";

class Obs extends ObsSocket {
    async toggleSource(item, duration) {
        try {
            // Grab current scene name so we can turn it off even if the scene is changed.
            const { name } = await this.obs.send("GetCurrentScene");
            await this.obs.send("SetSceneItemProperties", { "scene-name": name, item, visible: true });

            setTimeout(() => {
                this.obs.send("SetSceneItemProperties", { "scene-name": name, item, visible: false });
            }, 1000 * duration);
        } catch ({ error }) {
            console.log("[OBS]", item, error);
        }
    }
}

export default Obs;
