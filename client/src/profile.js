import BioEditor from "./bioeditor";
import ProfilePic from "./profilepic";

export default function Profile(props) {
    return (
        <div id="profileContainer">
            <div>
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
            <BioEditor
                bio={props.bio}
                bioInApp={(bio) => props.bioInApp(bio)}
            />
        </div>
    );
}
