const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const config = require("config");
const passport = require("passport");
const { check, validationResult } = require("express-validator/check");

// Load validations
const validateLoginInput = require("../../validations/login");

// @route   POST api/users/
// @desc    Register User
// @access  Public
router.post(
	"/",
	[
		check("email", "Enter Valid Email").isEmail(),
		check("password", "Length should be greater than 6").isLength({ min: 6 }),
		check("name", "Name is required")
			.not()
			.isEmpty()
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { name, email, password } = req.body;

		try {
			let user = await User.findOne({ email });

			if (user) {
				return res
					.status(400)
					.json({ errors: [{ msg: "User Already Exists" }] });
			}

			const avatar = gravatar.url(email, {
				s: "200", // size
				r: "pg", // rating
				d: "mm"
			});

			user = new User({
				name,
				email,
				avatar,
				password
			});

			const salt = await bcrypt.genSalt(10);
			user.password = await bcrypt.hash(password, salt);
			await user.save();

			const payload = {
				user: {
					id: user.id
				}
			};

			jwt.sign(
				payload,
				config.get("jwtSecret"),
				{ expiresIn: 36000 },
				(err, token) => {
					if (err) throw err;
					res.send({ token });
				}
			);
		} catch (err) {
			console.error(err.message);
			res.status(500).send("Server error");
		}
	}
);

// @route   POST login
// @desc    Login user / return token
// @access  public
router.post("/login", (req, res) => {
	const email = req.body.email;
	const password = req.body.password;

	User.findOne({ email }).then(user => {
		const { errors, isValid } = validateLoginInput(req.body);

		// Check validations
		if (!isValid) {
			return res.status(400).json(errors);
		}

		if (!user) {
			errors.email = "User not found";
			return res.status(404).json(errors);
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
				errors.password = "Incorrect password";
				return res.status(400).json(errors);
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
