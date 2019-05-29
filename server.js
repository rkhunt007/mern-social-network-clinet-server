const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

const app = express();

// connect DB
connectDB();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

const users = require("./routes/api/users");
const posts = require("./routes/api/posts");
const profiles = require("./routes/api/profiles");

// Passport middleware
app.use(passport.initialize());

// Passport Config
require("./config/passport")(passport);

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

app.use("/api/users", users);
app.use("/api/profiles", profiles);
app.use("/api/posts", posts);

app.get("/", (req, res) => res.send("hello"));
