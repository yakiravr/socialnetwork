import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class ResetPassword extends React.Component {
    constructor() {
        super();
        this.state = {
            error: false,
            sucsses: true,
            step: 1,
        };
    }

    handleClick() {
        axios
            .post("/login/verification", this.state)
            .then(({ data }) => {
                if (data) {
                    this.setState({
                        step: 2,
                    });
                } else {
                    console.log("error in handleClick");
                    this.setState({
                        error: true,
                        sucsses: false,
                    });
                }
            })
            .catch((err) => {
                console.log("err in axios POST verification:", err);
            });
    }

    handleClickReset() {
        axios
            .post("/login/rest", this.state)
            .then(({ data }) => {
                if (data) {
                    this.setState({
                        step: 3,
                    });
                } else {
                    console.log("error in handleClickReset");
                    this.setState({
                        error: true,
                        sucsses: false,
                    });
                }
            })
            .catch((err) => {
                console.log("err in axios POST reset:", err);
            });
    }

    handleChange(e) {
        this.setState(
            {
                [e.target.name]: e.target.value,
            },

            () => console.log("handleChange: ", this.state)
        );
    }

    render() {
        const { step } = this.state;
        if (step == 1) {
            return (
                <div>
                    <div className="logo_in_registration">
                        <img src="icon.png" alt="Scream" />
                    </div>
                    <br></br>
                    <br></br>
                    <h1 id="restH1">rest password</h1>

                    <br></br>
                    <br></br>
                    <div id="restcontainer">
                        <input
                            name="email"
                            placeholder="Email"
                            onChange={(e) => this.handleChange(e)}
                        />

                        {this.state.error && (
                            <p className="error">something went wrong</p>
                        )}
                    </div>

                    <button
                        id="submit-buttonRest"
                        onClick={() => this.handleClick()}
                    >
                        Send
                    </button>
                    <button id="submit-buttonRest">
                        <Link
                            id="submit-buttonRestBack"
                            to="/login"
                            className="Link"
                        >
                            {" "}
                            Back
                        </Link>
                    </button>
                </div>
            );
        } else if (step == 2) {
            return (
                <div id="on-reset">
                    <br></br>
                    <br></br>
                    <input
                        name="code"
                        placeholder="code"
                        onChange={(e) => this.handleChange(e)}
                    />
                    <br></br>
                    <br></br>

                    <input
                        name="newpass"
                        placeholder="New Password"
                        type="password"
                        onChange={(e) => this.handleChange(e)}
                    />
                    {this.state.error && (
                        <p className="error">something went wrong</p>
                    )}
                    <button
                        id="submit-button"
                        onClick={() => this.handleClickReset()}
                    >
                        Submit
                    </button>
                    <br></br>
                    <br></br>
                </div>
            );
        } else if (step == 3) {
            return (
                <div id="logUpdate">
                    <h1>Password Updated</h1>
                    <button id="submit-buttonRestUpdate">
                        <Link id="submit-buttonRestBack" to="/login">
                            Back
                        </Link>
                    </button>
                </div>
            );
        }
    }
}
