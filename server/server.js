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
const uidSafe = require("uid-safe");
const config = require("./config.json");

// this is our socket.io boilerplate
const server = require("http").Server(app); //app because of first handshake handshake
const io = require("socket.io")(server, {
    allowRequest: (req, callback) =>
        callback(null, req.headers.referer.startsWith("http://localhost:3000")),
});

///socket///

///upload///

const multer = require("multer");
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

const cookieSessionMiddleware = cookieSession({
    secret: `eating is an intentional act`,
    maxAge: 1000 * 60 * 60 * 24 * 14,
});

app.use(cookieSessionMiddleware);
io.use(function (socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

app.use(csurf());
app.use(function (req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});

app.use(compression());
app.use(express.static(path.join(__dirname, "..", "client", "public")));
app.use(express.json());

//_________________________________________
app.get("/welcome", (req, res) => {
    if (req.session.userId) {
        res.redirect("/");
    } else {
        res.sendFile(path.join(__dirname, "..", "client", "index.html"));
    }
});
app.post("/registration", (req, res) => {
    const { firstname, lastname, email, password } = req.body;
    hash(password)
        .then((hashPassword) => {
            db.addUser(firstname, lastname, email, hashPassword)
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
            res.json({ rows });
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

app.post("/bio", (req, res) => {
    const userId = req.session.userId;
    const { bio } = req.body;
    db.updateBio(bio, userId)
        .then(({ rows }) => {
            res.json({ data: rows });
        })
        .catch((error) => {
            console.log("error in bio post server", error);
        });
});
//____________________________________________________________________
app.get("/api/user/:id", (req, res) => {
    db.getUser(req.params.id)
        .then(({ rows }) => {
            if (!req.session.userId) {
                res.json({ error: true, success: false });
            } else {
                res.json({ rows });
            }
        })
        .catch((error) => {
            console.log("error /api/user/:id server: ", error);
        });
});

//____________________________________________________________________
app.get("/api/users/:most_recently", (req, res) => {
    db.recentUsers()
        .then(({ rows }) => {
            res.json({ success: true, recUsers: rows });
        })
        .catch((error) => {
            console.log("error in get most recent", error);
            res.json({ success: false, error: true });
        });
});

app.get("/api/search/:users", (req, res) => {
    db.searchResults(req.params.users)
        .then(({ rows }) => {
            if (rows) {
                res.json({ success: true, error: false, users: rows });
            }
        })
        .catch((error) => {
            console.log("error in search", error);
            res.json({ error: true, success: false });
        });
});

app.get("/logout", (req, res) => {
    req.session = null;
    res.redirect("/");
});
//____________________________________________________________________
app.get("/friendshipCheck/:idRoute", (req, res) => {
    db.getFriendshipStatus(req.session.userId, req.params.idRoute)
        .then(({ rows }) => {
            console.log("rows in friendshipCheck: ", rows);
            if (rows[0].length === 0) {
                res.json({ arrayData: false });
            } else if (rows[0].accepted == true) {
                res.json({ arrayData: true, accepted: true });
            } else if (
                rows[0].accepted == false &&
                rows[0].receiver_id == req.session.userId
            ) {
                res.json({ arrayData: true, acceptedfriendship: true });
            } else if (
                rows[0].accepted == false &&
                rows[0].sender_id == req.session.userId
            ) {
                res.json({ arrayData: true });
            } else {
                res.json({ arrayData: false });
            }
        })
        .catch((error) => {
            console.log("Error in get friendshipCheck: ", error);
        });
});

app.post("/request/:idRoute", (req, res) => {
    db.requestFriendship(req.session.userId, req.params.idRoute)
        .then(() => {
            res.json({
                arrayData: true,
            });
        })
        .catch((error) => {
            console.log("Error in post request:", error);
            res.json({ arrayData: false });
        });
});

app.post("/accepted/:idRoute", (req, res) => {
    db.acceptFriendship(req.session.userId, req.params.idRoute)
        .then(({ rows }) => {
            res.json(rows);
        })
        .catch((error) => {
            console.log("Error in post accepted:", error);
            res.json({ arrayData: false });
        });
});

app.post("/cancel/:idRoute", (req, res) => {
    db.cancelriendship(req.session.userId, req.params.idRoute)
        .then(({ rows }) => {
            res.json(rows);
        })
        .catch((err) => {
            console.log("Error in post cancel:", err);
            res.json({ arrayData: false });
        });
});

//____________________________________________________________________
app.get("/friendsNwannabes", (req, res) => {
    db.friendsAction(req.session.userId)
        .then(({ rows }) => {
            res.json({ rows, success: true });
            console.log("rows friends obj:", rows);
        })
        .catch((err) => {
            console.log("error in get friendsNwannabes :", err);
            res.json({ success: false });
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

server.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});

//____________________________________________________________________
let onlineUsers = {};
io.on("connection", (socket) => {
    if (!socket.request.session.userId) {
        return socket.disconnect(true);
    }
    const userId = socket.request.session.userId;
    if (!userId) {
        return socket.disconnect(true);
    }
    //___________________________________________________________
    onlineUsers[socket.id] = userId;
    console.log("onlineUsers[socket.id]", onlineUsers[socket.id]);
    console.log("userId", userId);
    const arrayOfObj = Object.values(onlineUsers);

    //The Object.values() method returns an array of a given object's:id
    const online = arrayOfObj.filter((users) => {
        return users.length != 0 && users != userId;
    });

    //no userId display

    db.getUserByIds(online).then(({ rows }) => {
        io.sockets.emit("online", rows);
    });

    socket.on("disconnect", () => {
        delete onlineUsers[socket.id];
        // console.log(`Socket with id: ${socket.id} is disconnected!`);
    });
    //___________________________________________________________

    db.getTenMessages()
        .then(({ rows }) => {
            socket.emit("chatMsg", rows.reverse());
        })
        .catch((error) => {
            console.log("error in 10 Msg server:", error);
        });

    socket.on("chatMsg", (messageOnSocket) => {
        const message = messageOnSocket;
        console.log("massage on Socket", message);

        // console.log(`Socket with id: ${socket.id} has connected!`);
        db.insertMessage(userId, messageOnSocket).then(({ rows }) => {
            const created_at = rows[0].created_at;
            const id = rows[0].id;
            console.log("id server:", rows[0].id);
            console.log("reated_at server:", rows[0].created_at);
            db.getUser(userId)
                .then(({ rows }) => {
                    io.emit("userMsg", {
                        firstname: rows[0].firstname,
                        lastname: rows[0].lastname,
                        imgurl: rows[0].imgurl,
                        id,
                        msg: message,
                        created_at,
                    });
                })
                .catch((error) => {
                    console.log("error in insert Msg:", error);
                });
        });
    });
});
