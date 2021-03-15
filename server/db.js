const spicedPg = require("spiced-pg");

const db = spicedPg(
    process.env.DATABASE_URL || `postgres:postgres:postgres@localhost:5432/SN`
);

module.exports.addUser = (firstname, lastname, email, password_hash) => {
    const q = `INSERT INTO users (firstname,  lastname , email, password_hash)
        VALUES ($1,$2,$3,$4)
        RETURNING id
        `;
    const params = [firstname, lastname, email, password_hash];
    return db.query(q, params);
};

module.exports.getLogin = (email) => {
    const q = `SELECT id, password_hash FROM users WHERE email = $1`;
    const params = [email];
    return db.query(q, params);
};

//_______________________________________________

module.exports.addCode = (email, secret_code) => {
    const q = `
        INSERT INTO resetPass  (email, code)
        VALUES ($1, $2)
        RETURNING *
    `;
    const params = [email, secret_code];
    return db.query(q, params);
};

module.exports.getCodeIntreval = () => {
    const q = `
        SELECT * FROM resetPass 
WHERE CURRENT_TIMESTAMP - created_at < INTERVAL '3 minutes';
    `;

    return db.query(q);
};

module.exports.updatePassword = (email, password_hash) => {
    const q = `
        UPDATE users
SET password_hash = $2
WHERE email = $1
    `;
    const params = [email, password_hash];
    return db.query(q, params);
};
//_______________________________________________

module.exports.uploadImg = (imgUrl, userId) => {
    const q = `
    UPDATE users
    SET imgurl  = $1
    WHERE id = $2
    `;
    const params = [imgUrl, userId];
    return db.query(q, params);
};

module.exports.getUser = (id) => {
    const q = `
    SELECT firstname,lastname,imgurl, bio
    FROM users
    WHERE id = $1
    `;
    const params = [id];
    return db.query(q, params);
};
//_______________________________________________
module.exports.updateBio = (bio, userId) => {
    const q = `
    UPDATE users
    SET bio = $1
    WHERE id = $2
    RETURNING bio;
    `;
    const params = [bio, userId];
    return db.query(q, params);
};
