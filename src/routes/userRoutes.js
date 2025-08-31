const express = require("express");
const verifyToken = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");
const router = express.Router();

// Only Admin can access
router.get("/admin", verifyToken, authorizeRoles("admin"), (req, res) => {
  res.json({ message: "Welcome Admin" });
});

// Only User can access
router.get("/user", verifyToken, authorizeRoles("user"), (req, res) => {
  res.json({ message: "Welcome User" });
});

// Both Admin and User can access
router.get("/", verifyToken, authorizeRoles("admin", "user"), (req, res) => {
  res.json({ message: "Welcome All Users" });
});

module.exports = router;
