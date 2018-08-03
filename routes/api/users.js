const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");

// @route   GET
// @desc    tests user router
// @access  public
router.get("/test", (req, res) => res.json({ msg: "users test works" }));

// @route   POST
// @desc    register
// @access  public
router.post("/register", (req, res) => {
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      res.status(400).json({ email: "Email is already registered" });
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: "200", // size
        r: "pg", // rating
        d: "mm"
      }); // default

      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.send(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// @route   POST login
// @desc    Login user / return token
// @access  public
router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email }).then(user => {
    if (!user) {
      return res.status(404).json({ email: "User not found" });
    }
    if (!password) {
      return res.status(400).json({ msg: "please enter password" });
    }

    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        return res.status(200).json({ msg: "Success" });
      } else {
        return res.status(400).json({ msg: "incorrect password" });
      }
    });
  });
});

module.exports = router;
