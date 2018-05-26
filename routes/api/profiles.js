const express = require("express");
const router = express.Router();

// @route   GET
// @desc    tests profile router
// @access  public
router.get("/test", (req, res) => res.json({ msg: "profiles test works" }));

module.exports = router;
