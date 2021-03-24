import { useEffect, useRef } from "react";
import { socket } from "./socket";
import { useSelector } from "react-redux";


export default function Chat() {
    const chatMessages = useSelector((state) => state && state.messagesState);


    const elemRef = useRef();



    useEffect(() => {
        elemRef.current.scrollTop =
            elemRef.current.scrollHeight - elemRef.current.clientHeight;
        console.log("new scrollTop:", elemRef.current.scrollTop);
    }, [chatMessages]);

    function keyCode(e) {
        if (e.key == "Enter") {
            e.preventDefault();
            //e.target.value;
            socket.emit("chatMsg", e.target.value);
            e.target.value = "";
        }
    }

    return (
        <div id="chat-box">
            <div id="TITELchat">
                C<br></br> <br></br>H <br></br> <br></br>A <br></br>
                <br></br> T <br></br>
            </div>

            <div className="chat-messages" ref={elemRef}>
                {chatMessages &&
                    chatMessages.map(function (send_msg) {
                        return (
                            <div className="chatContainer" key={send_msg.id}>
                                <img
                                    className="chat-img"
                                    src={send_msg.imgurl}
                                ></img>

                                <div id="messageInfo">
                                    <p>
                                        {send_msg.firstname} {send_msg.lastname}{" "}
                                        {send_msg.created_at}
                                    </p>
                                </div>
                                <div className="msg">{send_msg.msg}</div>
                            </div>
                        );
                    })}
            </div>
            <textarea
                id="textarea-chat"
                onKeyDown={keyCode}
                placeholder="send a message"
            ></textarea>
        </div>
    );
}
