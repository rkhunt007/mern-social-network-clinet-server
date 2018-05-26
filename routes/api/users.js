const express = require("express");
const router = express.Router();

// @route   GET
// @desc    tests user router
// @access  public
router.get("/test", (req, res) => res.json({ msg: "users test works" }));

module.exports = router;
