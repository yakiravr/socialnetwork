import { Component } from "react";
import axios from "./axios";
import ProfilePic from "./profilepic";
import Uploader from "./uploader";
import Profile from "./profile";
import { BrowserRouter, Route } from "react-router-dom";
import { OtherProfile } from "./otherprofile";

export default class App extends Component {
    constructor() {
        super();
        this.state = {
            firstname: "",
            lastname: "",
            imgUrl: "",
            bio: "",
            success: true,
            error: false,
            uploaderIsVisible: false,
        };
    }

    componentDidMount() {
        axios
            .get("/user")
            .then(({ data }) => {
                let user = data.rows[0];
                if (data) {
                    this.setState({
                        firstname: user.firstname,
                        lastname: user.lastname,
                        imgUrl: user.imgurl,
                        bio: user.bio,
                    });
                } else {
                    this.setState({ error: true });
                }
            })
            .catch((error) => {
                console.log("err in axios POST /user: ", error);
            });
    }

    toggleUploader() {
        this.setState({
            uploaderIsVisible: !this.state.uploaderIsVisible,
        });
    }

    methodUploadInApp(arg) {
        this.setState({ imgUrl: arg });
    }

    BioInApp(arg) {
        this.setState({ bio: arg });
    }

    render() {
        return (
            <BrowserRouter>
                <div id="app-logo">
                    <img id="logo" src="../icon.png" />
                </div>
                <div id="appContainer">
                    <ProfilePic
                        imgUrl={this.state.imgUrl}
                        toggleUploader={() => this.toggleUploader()}
                    />
                    <Route
                        exact
                        path="/"
                        render={() => (
                            <Profile
                                firstname={this.state.firstname}
                                lastname={this.state.lastname}
                                bio={this.state.bio}
                                imgUrl={this.state.imgUrl}
                                toggleUploader={() => this.toggleUploader()}
                                BioInApp={(bio) => this.BioInApp(bio)}
                            />
                        )}
                    />
                    <Route
                        path="/user/:id"
                        render={(props) => (
                            <OtherProfile
                                key={props.match.url}
                                match={props.match}
                                history={props.history}
                            />
                        )}
                    />
                    {this.state.uploaderIsVisible && (
                        <div id="upload">
                            <Uploader
                                methodUploadInApp={(imgUrl) =>
                                    this.methodUploadInApp(imgUrl)
                                }
                                toggleUploader={() => this.toggleUploader()}
                            />
                        </div>
                    )}
                </div>
            </BrowserRouter>
        );
    }
}
