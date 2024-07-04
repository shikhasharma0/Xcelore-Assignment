const express = require("express");
const authController = require("../controllers/authController");


const router = express.Router();

// Login route
router.post("/login", authController.loginUser);

// Signup route
router.post("/signup", authController.registerUser);

// Update user route
router.put("/userUpdate/:id", authController.updateUser);

// Get all users route
router.get("/users", authController.getAllUsers);

router.get("/user/:id", authController.getUserById);


module.exports = router;