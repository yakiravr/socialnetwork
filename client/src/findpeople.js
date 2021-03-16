import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "./axios";

export default function FindPeople() {
    const [searchTerm, setSearchTerm] = useState();
    const [users, setUsers] = useState();

    useEffect(() => {
        if (searchTerm) {
            axios.get("/api/search/" + searchTerm).then(({ data }) => {
                setUsers(data.users);
            });
        } else {
            axios.get("api/users/:most_recently").then(({ data }) => {
                setUsers(data.recUsers);
            });
        }
    }, [searchTerm]);

    return (
        <>
            <div id="findPPL">
                <h1>Find people</h1>
                {users &&
                    users.map((users) => {
                        return (
                            <div key={users.id}>
                                <Link to={`/user/${users.id}`}>
                                    <p>
                                        <img src={users.imgurl} /> {""}
                                        {users.firstname} {""}
                                        {users.lastname}
                                    </p>
                                </Link>
                            </div>
                        );
                    })}
                <div className="searchTerm">
                    <input
                        placeholder={searchTerm}
                        onChange={({ target }) => setSearchTerm(target.value)}
                    />
                </div>
            </div>
        </>
    );
}
