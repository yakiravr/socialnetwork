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
                <div className="on-reset">
                    <h1>Reset Password</h1>
                    <span>Email</span>

                    <input
                        name="email"
                        placeholder="Email"
                        onChange={(e) => this.handleChange(e)}
                    />

                    {this.state.error && (
                        <p className="error">something went wrong</p>
                    )}

                    <button onClick={() => this.handleClick()}>Send</button>
                    <Link to="/" className="Link">
                        Back
                    </Link>
                </div>
            );
        } else if (step == 2) {
            return (
                <div className="on-reset">
                    <h1>Confirm</h1>
                    <h1>Secret Code</h1>
                    <input
                        name="code"
                        placeholder="code"
                        onChange={(e) => this.handleChange(e)}
                    />
                    <span>New Password</span>
                    <input
                        name="newpass"
                        placeholder="New Password"
                        type="password"
                        onChange={(e) => this.handleChange(e)}
                    />
                    {this.state.error && (
                        <p className="error">something went wrong</p>
                    )}
                    <button onClick={() => this.handleClickReset()}>
                        Submit
                    </button>
                    <Link to="/" className="Link">
                        Back
                    </Link>
                </div>
            );
        } else if (step == 3) {
            return (
                <div className="on-reset">
                    <h1>Password Updated </h1>

                    <Link to="/login" className="Link">
                        Back
                    </Link>
                </div>
            );
        }
    }
}
