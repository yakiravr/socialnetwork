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
            <h1>Find people</h1>

            <div id="findpeople">
                <div className="searchTerm">
                    <input
                        placeholder="find profile"
                        onChange={({ target }) => setSearchTerm(target.value)}
                    />
                </div>

                <div id="search-results">
                    {users &&
                        users.map((users) => {
                            return (
                                <div key={users.id}>
                                    <Link to={`/user/${users.id}`}>
                                        <img
                                            src={users.imgurl}
                                            id="findpeople-img"
                                        />
                                        <div id="names">
                                            {users.firstname}
                                            {users.lastname}
                                        </div>
                                    </Link>
                                </div>
                            );
                        })}
                </div>
                <div>
                    <img id="search" src="search.png" alt="search" />
                </div>
            </div>
        </>
    );
}
