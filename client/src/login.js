import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class Login extends React.Component {
    constructor() {
        super();
        this.state = {
            success: true,
            error: false,
        };
    }

    handleClick() {
        axios
            .post("/login", this.state)
            .then(({ data }) => {
                if (data.success) {
                    location.replace("/");
                } else {
                    this.setState({ error: true });
                }
            })
            .catch((error) => {
                console.log("err in axios POST /login: ", error);
            });
    }

    handleChange(e) {
        this.setState(
            {
                [e.target.name]: e.target.value,
            },

            () => console.log("this.state after setState: ", this.state)
        );
    }
    render() {
        return (
            <div>
                <div>
                    <div className="logo_in_registration">
                        <img src="icon.png" alt="Scream" />
                    </div>
                    <br></br>
                    <br></br>
                    <div id="registration">
                        <div id="log">Login</div>
                        <br></br>
                        <br></br>
                        {this.state.error && <p>something went wrong :(</p>}
                        <input
                            name="email"
                            type="text"
                            placeholder="Email Address"
                            onChange={(e) => this.handleChange(e)}
                        />
                        <br></br>
                        <br></br>
                        <input
                            name="password"
                            type="password"
                            placeholder="Password"
                            onChange={(e) => this.handleChange(e)}
                        />
                        <br></br>
                        <br></br>
                        <div>
                            <button
                                id="submit-button"
                                onClick={() => this.handleClick()}
                            >
                                Login!
                            </button>
                            <div id="linksLogin">
                                <Link to="/verification">
                                    {" "}
                                    Rest-Password ||
                                </Link>

                                <Link to="/"> Registration</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
