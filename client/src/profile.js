import BioEditor from "./bioeditor";
import ProfilePic from "./profilepic";

export default function Profile(props) {
    return (
        <div id="profile-container">
            <h1>
                {props.firstname}
                <br></br>
                {props.lastname}
            </h1>
            <div id="">
                <ProfilePic
                    imgUrl={props.imgUrl}
                    lastname={props.lastname}
                    toggleUploader={() => props.toggleUploader()}
                />
            </div>
            <BioEditor BioInApp={(bio) => props.BioInApp(bio)} />
            {props.bio}
        </div>
    );
}
