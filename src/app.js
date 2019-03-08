import Chat from "./chat";
import Obs from "./obs";
import config from "../config";

const OBS = new Obs(config.obs);
const client = new Chat(config.twitchChat, OBS);
