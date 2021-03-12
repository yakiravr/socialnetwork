import { Component } from "react";
import axios from "./axios";

export default class Uploader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            file: null,
            error: false,
        };
    }

    componentDidMount() {
        console.log("uploader mounted!");
    }

    handleChange(e) {
        this.setState(
            {
                file: e.target.files[0],
            },
            () => console.log("this.state after setState: ", this.state)
        );
    }

    handleClick() {
        var formData = new FormData();
        formData.append("file", this.state.file);
        axios
            .post("/upload", formData)
            .then((res) => {
                this.props.methodUploadInApp(res.data.imgUrl);
            })
            .catch((error) => {
                console.log("error in post axios upload", error);
                this.setState({ error: true });
            });
    }

    render() {
        return (
            <div id="containerUploader">
                <h4 onClick={this.props.toggleUploader}>close</h4>
                <h3>change a profile picture</h3>
                <input
                    onChange={(e) => this.handleChange(e)}
                    name="file"
                    type="file"
                />
                <button onClick={() => this.handleClick()}>UPLOAD</button>
            </div>
        );
    }
}
