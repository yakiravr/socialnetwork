import BioEditor from "./bioeditor";
import ProfilePic from "./profilepic";

export default function Profile(props) {
    return (
        <div id="profileContainer">
            <div className="name">
                <h2>
                    {props.firstname} {props.lastname}
                </h2>
            </div>
            <div id="">
                <ProfilePic
                    imgUrl={props.imgUrl}
                    lastname={props.lastname}
                    toggleUploader={() => props.toggleUploader()}
                />
            </div>

            <BioEditor BioInApp={(bio) => props.BioInApp(bio)} />
            <p className="bio"> {props.bio}</p>
        </div>
    );
}
