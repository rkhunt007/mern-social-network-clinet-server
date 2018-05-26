const express = require("express");
const router = express.Router();

// @route   GET
// @desc    tests post router
// @access  public
router.get("/test", (req, res) => res.json({ msg: "posts test works" }));

module.exports = router;
