const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");

const port = process.env.PORT || 5000;

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

const users = require("./routes/api/users");
const posts = require("./routes/api/posts");
const profiles = require("./routes/api/profiles");

// DB config
const db = require("./config/keys").mongodbURI;

mongoose
  .connect(db)
  .then(() => console.log("connected to mongo"))
  .catch(error => console.log(error));

// Passport middleware
app.use(passport.initialize());

// Passport Config
require("./config/passport")(passport);

app.listen(port, () => console.log(`Server started on port ${port}`));

app.use("/api/users", users);
app.use("/api/profiles", profiles);
app.use("/api/posts", posts);

app.get("/", (req, res) => res.send("hello"));
