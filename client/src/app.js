import { Component } from "react";
import axios from "./axios";
import ProfilePic from "./profilepic";
import Uploader from "./uploader";
import Profile from "./profile";
import { BrowserRouter, Route, Link } from "react-router-dom";
import { OtherProfile } from "./otherprofile";
import FindPeople from "./findPeople";
import Friends from "./friends";

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

    bioInApp(arg) {
        console.log("update info in app,", arg);
        this.setState({
            bio: arg,
        });
    }

    logout() {
        axios.get("/logout").then(() => {
            localStorage.clear();
            window.location.reload();
        });
    }

    render() {
        return (
            <BrowserRouter>
                <h1 id="OVERDRAMAInApp">OVERDRAMA</h1>
                <div id="linksInApp">
                    <div id="app-logo">
                        <img id="logo" src="../icon.png" />
                    </div>
                    <Link id="friendsLink" to="/friends" >
                        {" "}
                        Friends And others ||
                    </Link>{" "}
                    <Link id="profileLink" to="/">
                        Profile ||
                    </Link>
                </div>
                <div id="findPeopleInApp">
                    <Link to={"/users"} className="color">
                        Find People
                    </Link>
                </div>
                <div id="logOut" onClick={() => this.logout()}>
                    Log-out
                </div>

                <Route path="/users" render={() => <FindPeople />} />

                <div id="appContainer">
                    <ProfilePic
                        imgUrl={this.state.imgUrl}
                        toggleUploader={() => this.toggleUploader()}
                    />
                    <div id="scream">
                        <div id="s">S</div>
                        <br></br>
                        <div id="c">C</div>
                        <br></br>
                        <div id="r">R</div>
                        <br></br>
                    </div>
                    <div id="scream2">
                        <div id="e">E</div>
                        <br></br>
                        <div id="a">A</div>
                        <br></br>
                        <div id="m">M</div>
                        <br></br>
                    </div>
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
                                bioInApp={(bio) => this.bioInApp(bio)}
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
                    <Route path="/friends" component={Friends} />

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
