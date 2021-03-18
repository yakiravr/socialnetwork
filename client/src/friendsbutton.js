import { useState, useEffect } from "react";
import axios from "./axios";

export function FriendButton(props) {
    const [buttonText, setButtonText] = useState();

    useEffect(() => {
        axios.get("/friend_status/" + props.match).then(({ data }) => {
            if (data) {
                console.log("Got state of friendship!");
                if (data.accepted) {
                    setButtonText("End Friend Request");
                } else if (data.Accept) {
                    setButtonText("Accept Friend Request");
                } else if (data.Cancel) {
                    setButtonText("Cancel Friend Request");
                }
            } else {
                setButtonText("Make Friend Request");
            }
        });
    }, []);

    function handleClick() {
        console.log("handelclick", buttonText);
        if (buttonText === "Make Friend Request") {
            axios
                .post("/friend_request/" + props.match)
                .then(() => {
                    setButtonText("Cancel Friend Request");
                })
                .catch(function (error) {
                    console.log("error in axios.post /friendrequest: ", error);
                });
        } else if (
            buttonText === "Cancel Friend Request" ||
            buttonText === "End Friend Request"
        ) {
            axios
                .post("/cancel_request/" + props.match)
                .then(() => {
                    setButtonText("Make Friend Request");
                })
                .catch((error) => {
                    console.log(
                        "error in axios.post /cancel_request/: ",
                        error
                    );
                });
        } else if (buttonText == "Accept Friend Request") {
            axios
                .post("/accept_request/" + props.match)
                .then(({ data }) => {
                    console.log("data accept req", data);
                    if (data) {
                        setButtonText("End Friend Request");
                    }
                })
                .catch((error) => {
                    console.log(
                        "error in axios.post /accept_request/: ",
                        error
                    );
                });
        }
    }

    return (
        <div>
            <button id="friend-in-friendsBtn" onClick={handleClick}>
                {buttonText}
            </button>
        </div>
    );
}
