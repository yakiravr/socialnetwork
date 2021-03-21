import BioEditor from "./bioeditor";
import ProfilePic from "./profilepic";
import { Link } from "react-router-dom";

export default function Profile(props) {
    return (
        <div id="profileContainer">
            <div id="findPeople">
                <Link to={"/users"} className="toUsers">
                    Find People
                </Link>
            </div>
            <div id="name">
                {props.firstname} {props.lastname}
            </div>

            <div id="profilePic">
                <ProfilePic
                    imgUrl={props.imgUrl}
                    lastname={props.lastname}
                    toggleUploader={() => props.toggleUploader()}
                />
            </div>
            <BioEditor
                bio={props.bio}
                bioInApp={(bio) => props.bioInApp(bio)}
            />
        </div>
    );
}
