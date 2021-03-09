import { Component } from "react";
import axios from "./axios";

export default class ResetPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            step: 1,
            success: true,
            error: false,
        };
    }

    handleClick() {
        axios
            .post("/login/verification", this.state)
            .then(({ data }) => {
                if (data.success) {
                    location.replace("login/rest");
                } else {
                    this.setState({ error: true });
                }
            })
            .catch((error) => {
                console.log("err in axios POST /login/verification", error);
            });
    }

    handleClickRest() {
        axios
            .post("/login/rest", this.state)
            .then(({ data }) => {
                if (data.success) {
                    location.replace("login");
                } else {
                    this.setState({ error: true });
                }
            })
            .catch((error) => {
                console.log("err in axios POST /login/verification", error);
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
        const { step } = this.state;
        if (step == 1) {
            return (
                <div>
                    <h1>.......</h1>
                    {this.state.error && <p>something went wrong :(</p>}
                    <input
                        name="email"
                        placeholder="email"
                        onChange={(e) => this.handleChange(e)}
                    />
                </div>
            );
        } else if (step == 2) {
            return (
                <div>
                    {this.state.error && <p>something went wrong :(</p>}
                    <input
                        name="code"
                        placeholder="code"
                        onChange={(e) => this.handleChange(e)}
                    />

                    <input
                        name="new password"
                        placeholder="new pass word"
                        type="password"
                        onChange={(e) => this.handleChange(e)}
                    />
                </div>
            );
        } else if (step == 3) {
            return (
                <div>
                    Yay, it worked!
                    {this.state.error && <p>something went wrong :(</p>}
                </div>
            );
        }
    }
}
