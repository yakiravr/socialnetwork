import { Component } from "react";
import axios from "./axios";
import ProfilePic from "./profilepic";
import Uploader from "./uploader";

export default class App extends Component {
    constructor() {
        super();
        this.state = {
            first: "",
            last: "",
            imgUrl: "",
            success: true,
            error: false,
            uploaderIsVisible: false,
        };
    }

    componentDidMount() {
        axios.get("/user").then(({ data }) => {
            if (data) {
                this.setState({
                    first: data.Iteration.first,
                    last: data.Iteration.last,
                    imgUrl: data.Iteration.imgurl,
                });
            } else {
                this.setState({ error: true });
            }
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

    render() {
        return (
            <div id="appContainer">
                <img id="logo" src="icon.png" />

                <ProfilePic
                    imgUrl={this.state.imgUrl}
                    toggleUploader={() => this.toggleUploader()}
                />
                <h1 id="name">{this.state.first}</h1>
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
        );
    }
}
