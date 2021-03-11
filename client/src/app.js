import { Component } from "react";
import axios from "./axios";
import ProfilePic from "./profilepic";
import Uploader from "./uploader";
import { BrowserRouter, Route } from "react-router-dom";

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            first: "me myself",
            last: "and i",
            image: "",
            bio: "",
            uploaderIsVisible: false,
        };
    }

    componentDidMount() {
        axios.get("/user").then((res) => {
            const { imageurl, first, last, bio } = res.data.user;
            this.setState({ imageurl, first, last, bio });
        });
    }

    toggleUploader() {
        // console.log('toggleModal function is running!!!');
        this.setState({
            uploaderIsVisible: !this.state.uploaderIsVisible,
        });
    }

    updatePicture(uploadedUrl) {
        console.log("UPLOADED URL:", uploadedUrl);
        this.setState({
            image: uploadedUrl,
            uploaderIsVisible: false,
        });
    }

    setBio(newBio) {
        this.setState({
            bio: newBio,
        });
    }

    setProfile(newProfile) {
        console.log("newProfile", newProfile);
        this.setState({
            profile: newProfile,
        });
    }

    render() {
        return (
            <div>
                <BrowserRouter>
                    <Route
                        exact
                        path="/"
                        render={() => (
                            <ProfilePic
                                first={this.state.first}
                                last={this.state.last}
                                image={this.state.image}
                            />
                        )}
                    />
                </BrowserRouter>

                <h2 onClick={() => this.toggleUploader()}>
                    Click here!! Changing uploaderIsVisible state with a
                    method!!
                </h2>
                {this.state.uploaderIsVisible && (
                    <Uploader
                        updatePicture={this.uploadedUrl}
                        toggleModal={() => this.toggleModal()}
                    />
                )}
            </div>
        );
    }
}
