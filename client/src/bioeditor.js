import React from "react";
import axios from "./axios";

export default class BioEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            edit: false,
        };
    }

    componentDidMount() {
        console.log("bio passed to BioEditor:", this.props.bio);
        if (this.props.bio) {
            this.setState({ edit: true });
        } else {
            this.setState({
                edit: false,
            });
        }
    }

    handleChange(e) {
        this.setState({ target: e.target.value });
    }

    SaveBttn() {
        if (this.state.bio == null) {
            const bioTarget = {
                bio: this.state.target,
            };
            axios
                .post("/bio", bioTarget)
                .then((res) => {
                    this.props.bioInApp(res.data.data[0].bio);
                    console.log("res fata info", res.data.data[0].bio);
                    this.setState({ target: !null, edit: false });
                })
                .catch((error) => {
                    console.log("error BioEditor: ", error);
                });
        } else {
            this.setState({ edit: false });
        }
    }

    insertBio() {
        this.setState({ edit: true });
    }

    render() {
        if (this.state.edit == false && this.props.bio) {
            return (
                <div className="editContainer">
                    <p>{this.props.bio}</p>
                    <p onClick={() => this.insertBio()}>Edit</p>
                </div>
            );
        }
        if (this.state.edit == true) {
            return (
                <div className="SaveBio">
                    <textarea
                        onChange={(e) => this.handleChange(e)}
                        defaultValue={this.props.bio}
                    ></textarea>
                    <p onClick={() => this.SaveBttn()}>Save Bio</p>
                </div>
            );
        } else if (this.state.edit == false && !this.props.bio) {
            return (
                <div className="addBio">
                    <p onClick={() => this.insertBio()}>Add Bio</p>
                </div>
            );
        }
    }
}
