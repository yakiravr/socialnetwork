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

exports.getLogin = (email) => {
    const q = `SELECT id, password FROM users WHERE email = $1`;
    const params = [email];
    return db.query(q, params);
};
