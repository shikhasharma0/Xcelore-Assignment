const express = require("express");
const authRoutes = require("./authRoute.js");

const router = express.Router();

// auth Routes
router.use("/user", authRoutes);

// Ticket ROutes

module.exports = router;