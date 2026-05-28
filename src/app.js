import express from "express";
import userModel from "./models/auth.model.js";
import jwt from "jsonwebtoken";
import cookie from "cookie-parser";

// Create an Express application
const app = express();

app.use(express.json());
app.use(cookie());

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
app.post("/api/auth/register", async (req, res) => {
    const { name, email } = req.body;

    // Validate the input
    if (!name || !email) {
        return res.status(400).json({ message: "Name and email are required" });
    }

    if (name.trim() === "" || email.trim() === "") {
        return res
            .status(400)
            .json({ message: "Name and email cannot be empty" });
    }

    // Validate email format using a simple regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format" });
    }

    // Save the user to the database
    const newUser = await userModel.create({
        name,
        email,
    });

    // Create token for the user
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
    });

    // Set the token in a cookie
    res.cookie("token", token);

    // Send the success response with the user data
    return res
        .status(201)
        .json({ message: "User registered successfully", user: newUser });
});

export default app;
