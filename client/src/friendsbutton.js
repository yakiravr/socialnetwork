import { useState, useEffect } from "react";
import axios from "./axios";

export function FriendButton(idRoute) {
    const [buttonText, setButtonText] = useState("Send Friend Request");

    useEffect(() => {
        axios.get("/friendshipCheck/" + idRoute.match).then(({ data }) => {
            if (data.arrayData) {
                console.log("Got state of friendship!");
                if (data.accepted) {
                    setButtonText("End Friendship");
                } else if (data.acceptedfriendship) {
                    setButtonText("Accept Friend Request");
                } else {
                    setButtonText("Cancel Friend Request");
                }
            }
        });
    }, []);

    const handleClick = () => {
        if (buttonText == "Send Friend Request") {
            axios
                .post("/request/" + idRoute.match)
                .then(() => {
                    setButtonText("Cancel Friend Request");
                })
                .catch((error) => {
                    console.log("error in axios.post /friendrequest: ", error);
                });
        } else if (
            buttonText == "Cancel Friend Request" ||
            buttonText == "End Friendship"
        ) {
            axios
                .post("/cancel/" + idRoute.match)
                .then(() => {
                    setButtonText("Send Friend Request");
                })
                .catch((error) => {
                    console.log("error in axios.post /friendrequest: ", error);
                });
        } else if (buttonText == "Accept Friend Request") {
            axios.post("/accepted/" + idRoute.match).then(() => {
                setButtonText("End Friendship");
            });
        }
    };

    return (
        <div>
            <button id="requestBttn" onClick={handleClick}>
                {buttonText}
            </button>
        </div>
    );
}
