import ObsSocket from "./ObsSocket";
import { search } from "fast-fuzzy";

class Obs extends ObsSocket {
    async toggleSource(item, duration) {
        try {
            // Grab current scene name so we can turn it off even if the scene is changed.
            const { name, sources } = await this.obs.send("GetCurrentScene");
            const res = search(item, sources, { keySelector: obj => obj.name });
            const source = res.length > 0 ? res[0].name : item;

            let data = { "scene-name": name, item: source, visible: false };

            if (res[0].render) {
                await this.obs.send("SetSceneItemProperties", data);
                this.emit("toggle", data);
            } else {
                data.visible = true;
                await this.obs.send("SetSceneItemProperties", data);
                this.emit("toggle", data);
            }

            if (!duration) return;

            setTimeout(() => {
                this.obs.send("SetSceneItemProperties", data);
                this.emit("toggle", data);
            }, 1000 * duration);
        } catch ({ error }) {
            console.log("[OBS]", item, error);
        }
    }
}

export default Obs;
