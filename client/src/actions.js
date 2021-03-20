import axios from "./axios";

export async function friendsAction() {
    const { data } = await axios.get("friendsNwannabes");

    return {
        type: "FRIENDS_WANNABES",
        arrayOfUsers: data.rows,
    };
}

export async function acceptFriendRequest(data) {
    console.log("data in acceptFriendRequest", data);
    await axios.post("/accepted/" + data);
    return {
        type: "ACCEPTREQUEST",
        id: data,
    };
}

export async function endFriendship(data) {
    await axios.post("/cancel/" + data);
    console.log("data in endfriendships", data);
    return {
        type: "CANCEL",
        id: data,
    };
}
