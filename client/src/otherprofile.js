import React from "react";
import axios from "./axios";

export class OtherProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        axios
            .get("/api/user/" + this.props.match.params.id)
            .then(({ data }) => {
                if (data) {
                    let fakeUser = data.rows[0];
                    this.setState({
                        imgUrl: fakeUser.imgurl,
                        firstname: fakeUser.firstname,
                        lastname: fakeUser.lastname,
                        bio: fakeUser.bio,
                    });
                } else {
                    this.props.history.push("/");
                }
            })
            .catch((error) => {
                console.log("error in axios /api/user/: ", error);
            });
    }

    render() {
        return (
            <div>
                <div id="profileContainer">
                    <h3 className="name">
                        {this.state.firstname} {this.state.lastname}
                    </h3>
                    <img src={this.state.imgUrl} />
                    <p className="bio">{this.state.bio}</p>
                </div>
            </div>
        );
    }
}
