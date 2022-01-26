const express = require("express");
const connectDB = require("./config/db");
const cors = require('cors');

const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());

// connect DB
connectDB();

// Init middleware
app.use(express.json({ extended: false }));

const users = require("./routes/api/users");
const posts = require("./routes/api/posts");
const profiles = require("./routes/api/profiles");
const auth = require("./routes/api/auth");

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

app.use("/api/users", users);
app.use("/api/profiles", profiles);
app.use("/api/posts", posts);
app.use("/api/auth", auth);

app.get("/", (req, res) => res.send("hello"));

// This is a test
