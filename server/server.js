const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const cookieSession = require("cookie-session");
const { hash, compare } = require("./bc");
const db = require("./db");
const csurf = require("csurf");
const crs = require("crypto-random-string");
const ses = require("./ses");
const s3 = require("./s3");
const config = require("./config.json");
///upload///

const multer = require("multer");
const uidSafe = require("uid-safe");

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function (uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
});
///upload///

app.use(compression());
app.use(express.static(path.join(__dirname, "..", "client", "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
    cookieSession({
        secret: `eating is an intentional act`,
        maxAge: 1000 * 60 * 60 * 24 * 14,
    })
);

app.use(csurf());
app.use(function (req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});

app.get("/welcome", (req, res) => {
    if (req.session.userId) {
        res.redirect("/");
    } else {
        res.sendFile(path.join(__dirname, "..", "client", "index.html"));
    }
});
app.post("/registration", (req, res) => {
    const { first, last, email, password } = req.body;
    hash(password)
        .then((hashPassword) => {
            db.addUser(first, last, email, hashPassword)
                .then(({ rows }) => {
                    req.session.userId = rows[0].id;
                    console.log("rows", rows[0].id);
                    res.json({ success: true });
                })
                .catch((error) => {
                    console.log("addUser db error: ", error);
                    res.json({ success: false });
                });
        })
        .catch((error) => {
            console.log("error in hash password: ", error);
            res.json({ success: false });
        });
});

app.post("/login", (req, res) => {
    const { email, password } = req.body;
    db.getLogin(email)
        .then(({ rows }) => {
            let passResult = rows[0].password_hash;
            compare(password, passResult)
                .then((compare) => {
                    if (compare) {
                        req.session.userId = rows[0].id;
                        res.json({ success: true });
                    } else {
                        res.json({ success: false });
                    }
                })
                .catch((err) => {
                    console.log("error in db getLogin: ", err);
                    res.json({ success: false });
                });
        })
        .catch((err) => {
            console.log("db.getLogin catch error: ", err);
            res.json({ success: false });
        });
});
//_____________________________________________

app.post("/login/verification", (req, res) => {
    if (req.body.email) {
        const { email } = req.body;
        db.getLogin(email).then((results) => {
            console.log("rows in getlogin", results);
            if (results.length === 0) {
                res.json({ success: false });
            }
            let code = crs({ length: 6 });

            db.addCode(email, code).then(({ rows }) => {
                console.log("row in addSecretcode", rows);
                ses.sendEmail(email, code, "Data")
                    .then(() => {
                        res.json({ step: 2, success: true, error: false });
                    })
                    .catch((err) => {
                        console.log("error in db getLogin: ", err);
                        res.json({ success: false, error: true });
                    })
                    .catch((err) => {
                        console.log("db.getLogin catch error: ", err);
                        res.json({ success: false, error: true });
                    });
            });
        });
    }
});

app.post("/login/rest", (req, res) => {
    const { code, newpass } = req.body;
    if (code && newpass) {
        db.getCodeIntreval()
            .then(({ rows }) => {
                console.log("getCodeIntreval", rows);
                if (rows.length === 0) {
                    res.json({ success: false });
                }
                if (code == rows[0].code) {
                    hash(newpass).then((hashPassword) => {
                        db.updatePassword(rows[0].email, hashPassword).then(
                            () => {
                                res.json({ step: 3, success: true });
                            }
                        );
                    });
                } else {
                    res.json({ success: false });
                }
            })
            .catch((err) => {
                console.log("error in db rest: ", err);
                res.json({ success: false });
            });
    }
});

//____________________________
app.get("/user", (req, res) => {
    const userId = req.session.userId;
    db.getUser(userId)
        .then(({ rows }) => {
            res.json({ Iteration: rows[0] });
        })
        .catch((err) => {
            console.log("error in getUser in /user get:", err);
            res.json({ success: false });
        });
});

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    const { filename } = req.file;
    const url = config.s3Url + filename;

    db.uploadImg(url, req.session.userId)
        .then(({ rows }) => {
            console.log("yessss it works a pic uploaded!", rows);
            res.json({ success: true, imgUrl: url });
        })
        .catch((error) => {
            console.log("eror in post upload:", error);
            res.json({ error: true });
        });
});
//____________________________________________________________________

app.get("*", function (req, res) {
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        res.sendFile(path.join(__dirname, "..", "client", "index.html"));
    }
});

app.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});
