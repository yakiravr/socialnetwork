export default function ProfilePic({ first, last, imageUrl }) {
    imageUrl = imageUrl || "default.png";
    return (
        <div>
            {first} {last}
            <div className="Pic">
                <img className="profile-pic" src={imageUrl} />
            </div>
        </div>
    );
}
