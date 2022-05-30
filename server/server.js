import Database from "better-sqlite3";
import express from "express";
import bcrypt from "bcrypt";
import cors from "cors";
const PORT = 8000;
const FAKE_LOADING_TIME = 0;

const app = express();
const db = new Database("./db/database.db");
// users: id int primary key autoincrement, username varchar(255) not null,
//        email varchar(255) not null, password varchar(255) not null
// user_profile: id int foreign key not null, first_name varchar(255), last_name varchar(255), bio varchar(2000), photo_url varchar(255), country char(2)

const loginTokens = {};

app.use(express.json());
app.use(cors());

const generateRandomToken = () => {
    return Math.random().toString(36).slice(2);
};

app.post("/users", (req, res) =>
    setTimeout(async () => {
        if (!req.body.username || !req.body.password)
            return res
                .status(400)
                .json({ error: "No username or password sent in request" });

        console.log(req.body);
        const user = db
            .prepare(
                "SELECT id, username, password FROM users WHERE username = ?"
            )
            .get(req.body.username);

        if (!user)
            return res
                .status(200)
                .json({ error: "No user found with specified username" });

        if (await bcrypt.compare(req.body.password, user.password)) {
            // LOGGED IN
            const token = generateRandomToken();
            loginTokens[token] = user;
            res.cookie("token", token);
            return res.status(200).json({ username: user.username, token });
        }
        return res.status(200).json({ error: "Wrong password" });
    }, FAKE_LOADING_TIME)
);

// user_profile: user_id int foreign key not null, first_name varchar(255), last_name varchar(255), bio varchar(2000), photo_url varchar(255), country char(2)
app.get("/users/profile/:username", (req, res) => {
    const token = req.headers.token;
    const username = req.params.username
        ? req.params.username
        : loginTokens[token].username;
    const search = db
        .prepare(
            "SELECT user_id, first_name, last_name, bio, photo_url, country FROM user_profile JOIN users on users.id = user_id WHERE users.username = ?"
        )
        .get(username);
    if (!search) {
        res.status(404).json({ error: "no profile found" });
    } else {
        res.status(200).json({ ...search, username });
    }
});

app.post("/users/profile/setup/", (req, res) => {
    const { first_name, last_name, bio, photo_url, country } = req.body;
    const { token } = req.headers;

    if (!Object.keys(loginTokens).includes(token)) {
        console.log(`couldnt find token ${token} in loginTokens`);
        return res.status(403).json({ error: "no token sent" });
    }

    const user_id = loginTokens[token].id;

    const search = db
        .prepare(
            "SELECT user_id from user_profile JOIN users ON user_id = users.id WHERE user_id = ?"
        )
        .get(user_id);

    const sql = !search
        ? "INSERT INTO user_profile (user_id, first_name, last_name, bio, photo_url, country) VALUES (?, ?, ?, ?, ?, ?)"
        : "UPDATE user_profile SET first_name = ?, last_name = ?, bio = ?, photo_url = ?, country = ? WHERE user_id = ?";

    const statement = db.prepare(sql);

    let out;
    if (!search) {
        out = statement.run(
            user_id,
            first_name,
            last_name,
            bio,
            photo_url,
            country
        );
    } else {
        out = statement.run(
            first_name,
            last_name,
            bio,
            photo_url,
            country,
            user_id
        );
    }
    console.log(out);
    console.log(
        `Updated ${user_id} profile with values: ${JSON.stringify({
            first_name,
            last_name,
            bio,
            photo_url,
            country,
        })}`
    );
    return res.status(200).json({
        out: `Updated user ${loginTokens[token].username}'s profile!`,
        updated: { first_name, last_name, bio, photo_url, country },
    });
});

app.post("/users/register", (req, res) =>
    setTimeout(async () => {
        console.log(req.body);
        const { username, email } = req.body;
        const hashed = await bcrypt.hash(req.body.password, 5);

        const checkname = db
            .prepare(
                "SELECT username, email FROM users WHERE username = ? OR email = ?"
            )
            .get(username, email);

        if (checkname) {
            return res.status(400).json({ error: "Username already exists" });
        }

        const statement = db.prepare(
            "INSERT INTO users (username, email, password) VALUES (?, ?, ?)"
        );
        try {
            const user = statement.run(username, email, hashed);
        } catch (error) {
            console.error(error);
            return res.status(501).json({ error: error.message });
        }
        res.status(200).json({
            out: `Created new user with username "${username}" and email: ${email}`,
        });
    }, 1500)
);

app.post("/sql", (req, res) => {
    console.log(req.body.sql);
    const statement = db.prepare(req.body.sql);
    const out = req.body.get ? statement.get() : statement.run();
    res.json({ out });
    console.log(out);
});

app.listen(PORT, () => {
    console.log("server listening on port " + PORT);
});

process.on("SIGINT", () => {
    db.close();
    process.exit();
});
