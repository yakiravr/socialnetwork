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
                <div className="logo_in_registration">
                    <img className="logo" src="icon.png" alt="Scream" />
                </div>

                <br />
                <br />
                <br />

                <div id="registration">
                    {this.state.error && <p>something went wrong :(</p>}
                    <input
                        name="firstname"
                        placeholder="first"
                        onChange={(e) => this.handleChange(e)}
                    />
                    <br></br>
                    <br></br>
                    <input
                        name="lastname"
                        placeholder="last"
                        onChange={(e) => this.handleChange(e)}
                    />
                    <br></br>
                    <br></br>
                    <input
                        name="email"
                        placeholder="email"
                        onChange={(e) => this.handleChange(e)}
                    />
                    <br></br>
                    <br></br>
                    <input
                        name="password"
                        placeholder="password"
                        type="password"
                        onChange={(e) => this.handleChange(e)}
                    />
                    <br></br>
                    <br></br>
                    <button
                        id="submit-button"
                        onClick={() => this.handleClick()}
                    >
                        submit
                    </button>
                    <div id="links">
                        <span>
                            {" "}
                            <Link to="/login">Login ||</Link>
                            <Link to="/verification"> Rest Password</Link>
                        </span>
                    </div>
                </div>
            </div>
        );
    }
}
