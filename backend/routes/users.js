import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../data/database.js";
import { authenticateToken, loginRateLimit } from "../middleware/auth.js";

const router = express.Router();

 /**
  * Name: Register User
  * 
  * Description: 
  * Handles user registration.
  * Expects email, password, first_name, last_name, phone_number, and date_of_birth in the request body. 
  * Checks for required fields, verifies if the user already exists, hashes the password, creates a new user, 
  * and returns the user data (excluding the password) on success.
  */
router.post("/register", async (req, res) => {
  try {
    const {
      email,
      password,
      first_name,
      last_name,
      phone_number,
      date_of_birth,
    } = req.body;

    if (!email || !password || !first_name || !last_name) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const userExists = await db.getUserByEmail(email);

    if (userExists) {
      return res
        .status(409)
        .json({ error: "User already exists with this email" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      email,
      password: hashedPassword,
      first_name,
      last_name,
      phone_number,
      date_of_birth,
      is_active: true,
      last_login: null,
    };

    await db.createUser(newUser);
    const { password: _, ...userResponse } = newUser;
    res.status(201).json({
      message: "User Created successfully",
      user: userResponse,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


/**
 * Name: User Login
 * 
 * Description: 
 * Authenticates a user. 
 * Expects email and password in the request body. 
 * Checks credentials, verifies password, updates last login, 
 * and returns a JWT token and user data (excluding the password) on success.
 */
router.post("/login", loginRateLimit, async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await db.getUserByEmail(email);

    if (!user) {
      req.incrementLoginAttempts();
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      req.incrementLoginAttempts();
      return res.status(401).json({ error: "Invalid credentials" });
    }

    user.last_login = new Date().toISOString();
    await db.updateUser(user.user_id, user);

    const token = jwt.sign(
      { userId: user.user_id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    const { password: _, ...userResponse } = user;
    res.json({
      message: "Login Successful",
      user: userResponse,
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * Name: Get User Profile
 * 
 * Description: 
 * Retrieves the profile of the authenticated user. 
 * Uses the user ID from the JWT token to fetch user data and returns it (excluding the password).
 */
router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const user = await db.getUserById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const { password: _, ...userResponse } = user;
    res.json({
      message: "Profile retrieved successfully",
      user: userResponse,
    });
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * Name: Update User Profile
 * Description: 
 * Updates the profile of the authenticated user.
 * Expects first_name, last_name, and phone_number in the request body (all optional).
 * Updates the user record and returns the updated user data (excluding the password).
 */
router.put("/profile", authenticateToken, async (req, res) => {
  try {
    const { first_name, last_name, phone_number } = req.body;

    const user = await db.getUserById(req.user.userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const updatedUser = {
      ...user,
      first_name: first_name || user.first_name,
      last_name: last_name || user.last_name,
      phone_number: phone_number || user.phone_number,
      updated_at: new Date().toISOString(),
    };

    await db.updateUser(req.user.userId, updatedUser);

    const { password: _, ...userResponse } = updatedUser;
    res.json({
      message: "Profile updated successfully",
      user: userResponse,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
