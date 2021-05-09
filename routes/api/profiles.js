const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const Profile = require("../../models/Profile");
const Post = require("../../models/Post");
const { check, validationResult } = require("express-validator/check");
const request = require("request");
const config = require("config");

const User = require("../../models/User");

// @route   GET api/profiles/me
// @desc    get current user's profile
// @access  private
router.get("/me", auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({
            user: req.user.id
        }).populate("user", ["name", "avatar"]);

        if (!profile) {
            return res.status(400).json({ msg: "There is no profile for this user" });
        }

        res.json(profile);
    } catch (e) {
        console.error(e.message);
        res.status(500).send("Server Error");
    }
});

// @route   POST api/profiles
// @desc    create/update user's profile
// @access  private
router.post(
    "/",
    [
        auth,
        [
            check("status", "status is required")
                .not()
                .isEmpty(),
            check("skills", "skills is required")
                .not()
                .isEmpty()
        ]
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const {
            company,
            website,
            location,
            bio,
            status,
            githubusername,
            skills,
            youtube,
            facebook,
            twitter,
            instagram,
            linkedin
        } = req.body;
        // Build Profile Object
        const profileFields = {};
        profileFields.user = req.user.id;
        if (company) profileFields.company = company;
        if (website) profileFields.website = website;
        if (location) profileFields.location = location;
        if (bio) profileFields.bio = bio;
        if (status) profileFields.status = status;
        if (githubusername) profileFields.githubusername = githubusername;
        if (skills) {
            profileFields.skills = skills.split(",").map(skill => skill.trim());
        }
        profileFields.social = {};
        if (youtube) profileFields.social.youtube = youtube;
        if (facebook) profileFields.social.facebook = facebook;
        if (twitter) profileFields.social.twitter = twitter;
        if (instagram) profileFields.social.instagram = instagram;
        if (linkedin) profileFields.social.linkedin = linkedin;
        try {
            let profile = await Profile.findOne({ user: req.user.id });
            if (profile) {
                // update profile
                profile = await Profile.findOneAndUpdate(
                    { user: req.user.id },
                    { $set: profileFields },
                    { new: true }
                );
                return res.json(profile);
            }
            // create profile
            profile = new Profile(profileFields);
            await profile.save();
            res.json(profile);
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server error");
        }
    }
);

// @route   GET api/profiles/
// @desc    get all profiles
// @access  public
router.get("/", async (req, res) => {
    try {
        const profiles = await Profile.find().populate("user", ["name", "avatar"]);
        res.json(profiles);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
});

// @route   GET api/profiles/user/:user_id
// @desc    get profile by user id
// @access  public
router.get("/user/:user_id", async (req, res) => {
    try {
        let profile = await Profile.findOne({
            user: req.params.user_id
        }).populate("user", ["name", "avatar"]);
        if (!profile) {
            return res.status(400).send("Profile with this user not found");
        }
        res.json(profile);
    } catch (error) {
        console.error(error.message);
        if (error.kind == "ObjectId") {
            return res.status(400).send("Profile with this user not found");
        }
        res.status(500).send("Server error");
    }
});

// @route   DELETE api/profiles/
// @desc    delete profile, user and todo
// @access  private
router.delete("/", auth, async (req, res) => {
    try {
        //remove user posts
        await Post.deleteMany({ user: req.user.id });

        // delete profile
        await Profile.findOneAndRemove({ user: req.user.id });

        // delete user
        await User.findOneAndRemove({ _id: req.user.id });
        res.json({ msg: "Profile Deleted" });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
});

// @route   PUT api/profiles/experience
// @desc    edit profile experience
// @access  private
router.put("/experience", [
    auth,
    [
        check('title', 'Title is Required').not().isEmpty(),
        check('company', 'Company is Required').not().isEmpty(),
        check('from', 'From is Required').not().isEmpty()
    ]
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { title, company, location, from, to, current, description } = req.body;
        const exp = { title, company, location, from, to, current, description };
        const profile = await Profile.findOne({ user: req.user.id });
        profile.experience.unshift(exp);
        await profile.save();

        res.json(profile);

    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
});

// @route   DELETE api/profile/experience
// @desc    delete profile experience
// @access  private
router.delete('/experience/:exp_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });
        profile.experience = profile.experience.filter((exp) => exp.id !== req.params.exp_id);
        await profile.save();
        res.json(profile);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
});

// @route   PUT api/profiles/education
// @desc    edit profile education
// @access  private
router.put("/education", [
    auth,
    [
        check('school', 'School is Required').not().isEmpty(),
        check('degree', 'Degree is Required').not().isEmpty(),
        check('filedofstudy', 'Field of Study is Required').not().isEmpty(),
        check('from', 'From Date is Required').not().isEmpty(),
    ]
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { school, degree, filedofstudy, from, to, current, description } = req.body;
        const edu = { school, degree, filedofstudy, from, to, current, description };
        const profile = await Profile.findOne({ user: req.user.id });
        profile.education.unshift(edu);
        await profile.save();

        res.json(profile);

    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
});

// @route   DELETE api/profiles/education
// @desc    delete profile education
// @access  private
router.delete('/education/:edu_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });
        profile.education = profile.education.filter((exp) => exp.id !== req.params.edu_id);
        await profile.save();
        res.json(profile);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
});

// @route   GET api/profiles/github/
// @desc    get github repos
// @access  public
router.get('/github/:username', (req, res) => {
    try {
        const options = {
            method: 'GET',
            uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&clientId=${config.get('githubClientId')}&clientSecret=${config.get('githubSecret')}`,
            headers: {
                'User-Agent': 'node.js'
            }
        }
        request(options, (err, response, body) => {
            if (err) console.error('api/profile/github/', err);

            if (response.statusCode !== 200) {
                return res.status(404).json({ msg: 'No github profile found' })
            }
            res.json(JSON.parse(body));
        })
    } catch (error) {
        console.error('api/profile/github/', error);
        res.status(500).send("Server error");
    }
});

module.exports = router;
