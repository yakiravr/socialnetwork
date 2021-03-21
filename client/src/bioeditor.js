import { Component } from "react";
import axios from "./axios";

export default class Bio extends Component {
    constructor(props) {
        super(props);
        this.state = {
            edit: false,
        };
    }

    componentDidMount() {
        console.log("bio passed to BioEditor:", this.props.bio);
        if (this.props.bio) {
            this.setState({
                bio: this.props.bio,
                // edit: true,
            });
        } else {
            this.setState({
                edit: false,
            });
        }
    }

    handleChange(e) {
        this.setState({ target: e.target.value });
    }

    SaveAddBttn() {
        if (this.state.target !== null) {
            const bioTarget = {
                bio: this.state.target,
            };
            console.log("this.state.target:", this.state.target);
            axios
                .post("/bio", bioTarget)
                .then((res) => {
                    this.props.bioInApp(res.data.data[0].bio);
                    this.setState({ edit: false });
                })
                .catch((error) => {
                    console.log("error from axios saveAdd: ", error);
                });
        } else {
            this.setState({ edit: true });
        }
    }

    insertBio() {
        this.setState({ edit: true, bio: this.state.bio });
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
                <div>
                    <textarea
                        id="SaveBio"
                        onChange={(e) => this.handleChange(e)}
                        defaultValue={this.props.bio}
                    ></textarea>

                    <div onClick={() => this.SaveAddBttn()}>Save Bio</div>
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
