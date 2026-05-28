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

/**
 * @route POST /api/notes
 * @description Create a new note need title and description in the request body
 * @access Public
 */
app.post("/api/notes", async (req, res) => {
    const { title, description } = req.body;

    // authenticate the user using the token from the cookie
    const token = req.cookies.token;
    const user = jwt.verify(token, process.env.JWT_SECRET);

    req.user = user; // { id: "user_id", email: "user_email" }

    // validate the input
    if (!title) {
        return res.status(400).json({ error: "Title is required" });
    }

    if (!description) {
        return res.status(400).json({ error: "Description is required" });
    }

    if (title.trim().length < 3) {
        return res.status(400).json({ error: "Title must be at least 3 characters long" });
    }

    if (description.trim().length < 10) {
        return res.status(400).json({ error: "Description must be at least 10 characters long" });
    }

    // save the note to the database

    const newNote = await NoteModel.create({
        title,
        description,
        user: req.user.email
    });

    // send the success response with the note data
    return res.status(201).json({
        message: "Note created successfully",
        note: newNote
    });
})



export default app;
