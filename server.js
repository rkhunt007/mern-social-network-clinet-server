const express = require("express");
const mongoose = require("mongoose");

const port = process.env.PORT || 5000;

const app = express();

const users = require("./routes/api/users");
const posts = require("./routes/api/posts");
const profiles = require("./routes/api/profiles");

// DB config
const db = require("./config/keys").mongodbURI;

mongoose
  .connect(db)
  .then(() => console.log("connected to mongo"))
  .catch(error => console.log(error));

app.listen(port, () => console.log(`Server started on port ${port}`));

app.use("/api/users", users);
app.use("/api/profiles", profiles);
app.use("/api/posts", posts);

app.get("/", (req, res) => res.send("hello"));
