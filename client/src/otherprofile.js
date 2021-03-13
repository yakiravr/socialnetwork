import React from "react";
import axios from "./axios";

export class OtherProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        axios
            .get("/")
            .then(({data}) => {
                if (data) {
                    this.props.history.push("/");
                } else {
                    this.setState({
                    });
                }
            })
            .catch()
            });
    }

    render() {
        return <div></div>;
    }
}
