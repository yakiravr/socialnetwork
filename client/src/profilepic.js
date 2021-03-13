export default function ProfilePic(props) {
    const imgUrl = props.imgUrl || "default.png";

    return (
        <div>
            <div>
                <img
                    src={imgUrl}
                    alt={props.lastname}
                    onClick={props.toggleUploader}
                />
            </div>
        </div>
    );
}
