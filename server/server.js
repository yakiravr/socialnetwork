const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const cookieSession = require("cookie-session");
const { hash, compare } = require("./bc");
const db = require("./db");
const csurf = require("csurf");
const cryptoRandomString = require("crypto-random-string");
const ses = require("./ses");

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

app.post("/login/verification", (req, res) => {
    const { email } = req.body;
    db.getLogin(email)
        .then(({ rows }) => {
            if (rows[0]) {
                const secretCode = cryptoRandomString({ length: 6 });
                //Send the email with the code to the specified email address using SES
                db.storingCode(email, secretCode).then(() => {
                    ses.sendEmail(email, secretCode);
                    res.json({ success: true });
                });
            } else {
                res.json({ success: false });
            }
        })
        .catch((err) => {
            console.log("error in verification: ", err);
            res.json({ success: false });
        });
});

app.post("login/rest", (req, res) => {
    // Find the code in the database by the email address in req.body
    const { code, newPass, email } = req.body;
    //Compare the code in req.body to the code from the database
    db.interval(email)
        .then(({ rows }) => {
            //If they are the same
            if (code === rows[0]) {
                console.log("rows", rows[0]);
                res.json({ success: true });
                //hash the password in req.body
                hash(newPass).then((hashPassword) => {
                    db.updatePassword(hashPassword).then(() => {
                        res.json({ success: true });
                    });
                });
            } else {
                res.json({ success: false });
            }
        })
        .catch((err) => {
            console.log("error in db rest: ", err);
            res.json({ success: false });
        });
});

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
