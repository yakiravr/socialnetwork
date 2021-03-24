import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { friendsAction, acceptFriendRequest, endFriendship } from "./actions";

export default function Friends() {
    const dispatch = useDispatch();

    const friends = useSelector((state) => {
        return (
            state.Friends &&
            state.Friends.filter((friend) => friend.accepted === true)
        );
    });

    const awaiting = useSelector((state) => {
        return (
            state.Friends &&
            state.Friends.filter((friend) => friend.accepted === false)
        );
    });

    useEffect(() => {
        dispatch(friendsAction());
    }, []);

    return (
        <div>
            {/* <img id="friendsLogo" src="friends.png" alt="friends" />*/}

            <div id="friendsInfriends">
                <div id="Awaiting">
                    {awaiting &&
                        awaiting.map((awaiting) => {
                            return (
                                <div key={awaiting.id}>
                                    <p>
                                        {awaiting.firstname} {awaiting.lastname}
                                    </p>
                                    <Link to={"/user/" + awaiting.id}>
                                        <img src={awaiting.imgurl} />
                                    </Link>

                                    <button
                                        id="acceptfrienshipbtn"
                                        className="Accept Reqeust"
                                        onClick={() =>
                                            dispatch(
                                                acceptFriendRequest(awaiting.id)
                                            )
                                        }
                                    >
                                        Accept Friend Request
                                    </button>

                                    <button
                                        id="rejectfrienshipbtn"
                                        className=" Reject Friend Request"
                                        onClick={() =>
                                            dispatch(endFriendship(awaiting.id))
                                        }
                                    >
                                        Reject Friend Request
                                    </button>
                                </div>
                            );
                        })}

                    <div id="endInFriends">
                        {friends &&
                            friends.map((friend) => {
                                return (
                                    <div key={friend.id}>
                                        <p>
                                            {friend.firstname} {friend.lastname}
                                        </p>
                                        <Link to={"/user/" + friend.id}>
                                            <img src={friend.imgurl} />
                                        </Link>

                                        <button
                                            id="endfrienshipbtn"
                                            className="End Friendship"
                                            onClick={() =>
                                                dispatch(
                                                    endFriendship(friend.id)
                                                )
                                            }
                                        >
                                            End Friendship
                                        </button>
                                    </div>
                                );
                            })}
                    </div>
                </div>
            </div>
        </div>
    );
}
