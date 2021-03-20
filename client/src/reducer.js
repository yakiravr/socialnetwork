export default function reducer(state = {}, action) {
    console.log("action", action);
    if (action.type === "FRIENDS_WANNABES") {
        state = {
            ...state,
            Friends: action.arrayOfUsers,
            accepted: true,
        };
    }

    if (action.type === "ACCEPTREQUEST") {
        state = {
            ...state,
            Friends: state.Friends.map((awaiting) => {
                if (awaiting.id == action.id) {
                    console.log("action id:", action.id);
                    return {
                        ...awaiting,
                        accepted: true,
                    };
                } else {
                    return awaiting;
                }
            }),
        };
    }
    

    if (action.type === "CANCEL") {
        state = {
            ...state,
            Friends: state.Friends.filter((friend) => friend.id !== action.id),
        };
    }

    return {
        ...state,
        accepted: false,
    };
}
