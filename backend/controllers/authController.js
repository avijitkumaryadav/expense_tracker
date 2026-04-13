const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// Register User
exports.registerUser = async (req, res, next) => {
  const { fullName, email, password, profileImageUrl } = req.body;

  // Validation Check for Missing fields
  if (!fullName || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Create the User
    const user = await User.create({
      fullName,
      email,
      password,
      profileImageUrl,
    });

    // status 201 for successful creation
    res.status(201).json({
      id: user._id,
      user,
      token: generateToken(user._id),
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error registering user", error: err.message });
  }
};

// Login User
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  // validation check for missing fields
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.status(200).json({
      id: user._id,
      user,
      token: generateToken(user._id),
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "email or password wrong", error: err.message });
  }
};

// Get User Info
exports.getUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (err) {
    return res.status(500).json({
      message: "Error getting user",
      error: err.message,
    });
  }
};

// Google Auth Verify and Login/Register
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.googleAuth = async (req, res) => {
  try {
    const { credential } = req.body;
    
    // Verify the google token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    const { name, email, picture, sub } = payload;
    
    // Check if user exists
    let user = await User.findOne({ email });
    
    if (!user) {
      // Register new user
      // Use google sub as a dummy password since bcrypt requires a password field.
      user = await User.create({
        fullName: name,
        email: email,
        password: sub, // securely hashed auto-generated string since sub is unique
        profileImageUrl: picture
      });
    } else {
      // If user exists and doesn't have a profile image, gently update it.
      if (!user.profileImageUrl && picture) {
        user.profileImageUrl = picture;
        await user.save();
      }
    }
    
    // create standard JWT mapping to our system
    res.status(200).json({
      id: user._id,
      user,
      token: generateToken(user._id),
    });
    
  } catch (err) {
    res.status(500).json({ message: "Google Auth Failed", error: err.message });
  }
};
