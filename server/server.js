const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const cookieSession = require("cookie-session");
const { hash } = require("./bc");
const db = require("./db");

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
                    res.json({ success: false });
                })
                .catch((error) => {
                    console.log("addUser db error: ", error);
                    res.json({ success: true });
                });
        })
        .catch((error) => {
            console.log("error in hash password: ", error);
            res.json({ success: true });
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
