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

module.exports.storingCode = (code, email) => {
    const q = `INSERT INTO reset_code (email, code)
    VALUES ($1, $2)
    ON CONFLICT (email) DO
    UPDATE SET code = $1;
    WHERE email =$2`;

    const params = [code, email];

    return db.query(q, params);
};

module.exports.interval = (code) => {
    const q = `SELECT code FROM rest_code
WHERE CURRENT_TIMESTAMP - created_at < INTERVAL '10 minutes'`;

    const params = [code];

    return db.query(q, params);
};

module.exports.updatePassword = (code, email) => {
    const q = `UPDATE users
SET password_hash = '$1'
WHERE email =$2`;

    const params = [code, email];

    return db.query(q, params);
};
