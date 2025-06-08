// routes for everything auth related

const express = require("express");
const router = express.Router();
const { registerUser, loginUser, deleteUser } = require("../controllers/authController");
const authenticate = require("../middleware/authenticate");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.delete("/delete-account", authenticate, deleteUser);

module.exports = router;