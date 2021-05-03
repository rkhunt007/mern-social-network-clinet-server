const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator/check");

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
				{ expiresIn: 36000000 },
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

module.exports = router;
