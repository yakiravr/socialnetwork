import { mostRecent, chat } from "./actions";
import { io } from "socket.io-client";

export let socket;

export const init = (store) => {
    if (!socket) {
        socket = io.connect();

        socket.on("hasConnected", (data) => {
            console.log("data socket: ", data);
        });

        socket.on("chatMsg", (msgs) => store.dispatch(mostRecent(msgs)));

        socket.on("userMsg", (msg) => store.dispatch(chat(msg)));
    }
};
