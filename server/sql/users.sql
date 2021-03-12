DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS resetPass;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first VARCHAR NOT NULL CHECK (first <> ''),
    last VARCHAR NOT NULL CHECK (last <> ''),
    email VARCHAR NOT NULL UNIQUE CHECK (email <> ''),
    password_hash VARCHAR NOT NULL CHECK (password_hash <> ''),
    imgUrl TEXT,
    bio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE resetPass  (
    id            SERIAL PRIMARY KEY,
    email         VARCHAR NOT NULL CHECK (email <> ''),
    code VARCHAR NOT NULL CHECK (code <> ''),
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);