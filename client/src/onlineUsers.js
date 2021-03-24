import { useSelector } from "react-redux";

export default function OnlineUsers() {
    const onlineUsers = useSelector((state) => state && state.onlineState);
    return (
        <div id="onlineContainer">
            <div id="onlinetitle">Online Users</div>
            <br></br>
            <br></br>
            {onlineUsers &&
                onlineUsers.map((online) => {
                    return (
                        <div id="onlineInfo" key={online.id}>
                            <div id="picOnline">
                                <img src={online.imgurl} />
                            </div>
                            <div id="onlineNames">
                                {online.firstname} {online.lastname}
                            </div>
                        </div>
                    );
                })}
        </div>
    );
}
