const express = require("express");
const router = express.Router();
const { registerUser, login } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

router.get("/me", protect, (req, res) => {
    res.status(200).json({ success: true, user: req.user });
});

router.post("/register", registerUser);
router.post("/login", login);

module.exports = router;