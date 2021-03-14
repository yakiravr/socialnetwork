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
                <div id="rest_in_egistration">
                    <Link to="/verification">rest password</Link>
                </div>
                <div className="login">
                    <div className="logo_container">
                        <img className="logo" src="icon.png" alt="Scream" />
                    </div>
                    <h1>Login</h1>
                    {this.state.error && <p>something went wrong :(</p>}
                    <input
                        name="email"
                        type="text"
                        placeholder="Email Address"
                        onChange={(e) => this.handleChange(e)}
                    />
                    <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        onChange={(e) => this.handleChange(e)}
                    />
                    <div className="loginBtn">
                        <button onClick={() => this.handleClick()}>
                            Login!
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}
