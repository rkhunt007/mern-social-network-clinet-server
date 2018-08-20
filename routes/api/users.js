const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");

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
        // Login success

        // create payload
        const payload = { id: user.id, name: user.name, avatar: user.avatar };
        jwt.sign(payload, keys.secret, { expiresIn: 3600 }, (err, token) => {
          res.status(200).json({
            success: true,
            token: "Bearer " + token
          });
        });
      } else {
        return res.status(400).json({ msg: "incorrect password" });
      }
    });
  });
});

// @route   GET login api/users/current
// @desc    Return current user
// @access  protected
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({ id: req.user.id, name: req.user.name, avatar: req.user.avatar });
  }
);

module.exports = router;
