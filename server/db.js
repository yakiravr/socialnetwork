const spicedPg = require("spiced-pg");

const db = spicedPg(
    process.env.DATABASE_URL || `postgres:postgres:postgres@localhost:5432/SN`
);

module.exports.addUser = (first, last, email, password_hash) => {
    const q = `INSERT INTO users (first, last, email, password_hash)
        VALUES ($1,$2,$3,$4)
        RETURNING id
        `;
    const params = [first, last, email, password_hash];
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
module.exports.addImage = (imageurl, id) => {
    const q = `UPDATE users
        SET imageurl= $1
        WHERE id = $2
        RETURNING imageurl
    `;
    const params = [imageurl, id];
    return db.query(q, params);
};
