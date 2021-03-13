import React from "react";
import axios from "./axios";

export default class BioEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            btnTxt: "",
            txtArea: false,
        };
    }
    componentDidMount() {
        if (!this.props.bio) {
            this.setState({
                btnTxt: "edit",
            });
        } else {
            this.setState({
                btnTxt: "add",
            });
        }
    }

    handleClick() {
        axios
            .post("/bio", { bio: this.state.target })
            .then(({ data }) => {
                console.log("bio post", data);
                if (data) {
                    this.props.BioInApp(this.state.target);
                    this.setState({
                        target: false,
                    });
                } else {
                    this.setState({ target: true });
                }
            })
            .catch((error) => console.log("err in axios POST /bio: ", error));
    }

    handleChange(e) {
        this.setState(
            {
                target: e.target.value,
            },
            () => console.log("this.state after setState: ")
        );
    }

    render() {
        return (
            <>
                <h1>
                    Who am I?
                    <br></br>
                    {this.props.bio}
                </h1>

                <br></br>
                {!this.state.target && (
                    <button
                        onClick={() => {
                            this.setState({ target: true });
                        }}
                    >
                        {this.state.btnTxt}
                    </button>
                )}
                <br></br>
                {this.state.target && (
                    <button onClick={() => this.handleClick()}>SAVE</button>
                )}

                <br></br>
                {this.state.target && (
                    <textarea
                        onChange={(e) => this.handleChange(e)}
                        defaultValue={this.props.bio}
                    />
                )}
                <br></br>
            </>
        );
    }
}
