import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class Registration extends React.Component {
    constructor() {
        super();
        this.state = {
            success: true,
            error: false,
        };
    }

    handleClick() {
        axios
            .post("/registration", this.state)
            .then(({ data }) => {
                if (data.success) {
                    location.replace("/");
                } else {
                    this.setState({ error: true });
                }
            })
            .catch((error) => {
                console.log("err in axios POST /registration: ", error);
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
                <div id="login_in_egistration">
                    <Link to="/login">Login</Link>
                </div>

                <div id="rest_in_egistration">
                    <Link to="/verification">rest password</Link>
                </div>
                <div className="logo_container">
                    <img className="logo" src="icon.png" alt="Scream" />
                </div>
                <div id="registration">
                    <h1></h1>
                    {this.state.error && <p>something went wrong :(</p>}
                    <input
                        name="firstname"
                        placeholder="first"
                        onChange={(e) => this.handleChange(e)}
                    />
                    <input
                        name="lastname"
                        placeholder="last"
                        onChange={(e) => this.handleChange(e)}
                    />
                    <input
                        name="email"
                        placeholder="email"
                        onChange={(e) => this.handleChange(e)}
                    />
                    <input
                        name="password"
                        placeholder="password"
                        type="password"
                        onChange={(e) => this.handleChange(e)}
                    />
                    <div className="submitReg">
                        <button onClick={() => this.handleClick()}>
                            submit!
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}
