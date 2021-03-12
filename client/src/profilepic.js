export default function ProfilePic(props) {
    const imgUrl = props.imgUrl || "default.png";

    return (
        <div className="pic">
            <img
                className="profilepic"
                src={imgUrl}
                alt={props.last}
                onClick={props.toggleUploader}
            />
        </div>
    );
}
