const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const { generateJWT } = require("../middelware/jwtTokens.js");
const User = require("../models/userModal.js");


// ************* Register Api *****************************************************

const registerUser = async (req, res) => {
  try {
    const { email, phone } = req.body;
    const existingUserWithEmail = await User.findOne({ email });

    const existingUserWithMobile = await User.findOne({ phone });

    if (existingUserWithEmail) {
      console.log("User Already Exist with this email");
      return res.json({
        success: false,
        message: "Email already exists, please choose another email",
        duplicateItem: "email",
      });
    } else if (existingUserWithMobile) {
      console.log("User with this mobile number already exists");
      return res.json({
        success: false,
        message:
          "Mobile number already exists, please choose another mobile number",
        duplicateItem: "mobile",
      });
    } else {
      const { password } = req.body;

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        role: "user",
        phone: req.body.phone,
        is_deactivated: false,
      });

      const response = await user.save();

      const token = await generateJWT(response._id);

      res.json({
        success: true,
        message: "User successfully registered",
        user: response,
        token: token,
      });
      console.log("User successfully registered");
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while registering the user." });
  }
};



// ************* Login Api *****************************************************


// const loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body; // Updated to extract 'email' instead of 'userId'

//     // Check if the input is an email or phone
//     const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

//     // Query based on whether the input is an email or phone
//     const query = isEmail ? { email: email } : { phone: email };
   
//     const existingUser = await User.findOne(query);
//     console.log(existingUser, "7388393")

//     if (!existingUser) {
//       return res.json({
//         success: false,
//         message: `Invalid ${isEmail ? "Email" : "phone"}`,
//       });
//     }

//     if (existingUser.is_deactivated) {
//       return res.json({
//         success: false,
//         message: "Your account has been deactivated",
//       });
//     }

//     const isPasswordValid = await bcrypt.compare(
//       password,
//       existingUser.password
//     );

//     if (!isPasswordValid) {
//       return res.json({
//         success: false,
//         message: "Invalid Password",
//       });
//     }

//     const token = await generateJWT(existingUser._id);
//     return res.json({
//       success: true,
//       message: "Login Success",
//       token: token,
//       role: existingUser.role,
//     });
//   } catch (error) {
//     console.log(error, "error occurred");
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// };

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists
    const existingUser = await User.findOne({ email });
    console.log(existingUser, "9999")
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: 'Invalid Email',
      });
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Password',
      });
    }

    // Generate JWT
    const token = jwt.sign({ userId: existingUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    return res.status(200).json({
      success: true,
      message: 'Login Success',
      token: token,
    });
  } catch (error) {
    console.log(error, 'error occurred');
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};


// ************* GetAllData Api *****************************************************


const getAllUsers = async (req, res) => {
  try {
    // Find all users
    const users = await User.find({});

    res.json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("Error retrieving users:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while retrieving users.",
    });
  }
};


// ************* GetSingleUser Api *****************************************************


const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Error retrieving user:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while retrieving the user.",
    });
  }
};





// ************* Update Api *****************************************************


const updateUser = async (req, res) => {
  try {
    const { id } = req.params; // Get the user ID from the request parameters
    const { name, email, phone, password, is_deactivated } = req.body; 

    // Find the user by ID
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update user details
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (password) user.password = await bcrypt.hash(password, 10);
    if (is_deactivated !== undefined) user.is_deactivated = is_deactivated;

    // Save the updated user
    await user.save();

    res.json({
      success: true,
      message: "User updated successfully",
      user,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while updating the user.",
    });
  }
};


module.exports = {
  registerUser,
  loginUser,
  getAllUsers,
  getUserById,
  updateUser,
};
