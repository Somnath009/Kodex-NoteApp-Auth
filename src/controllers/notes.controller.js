import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import NoteModel from "../models/notes.model.js";

/**
 * @Controller for creating a new note
 * @route POST /api/notes
 * @description Create a new note need title and description in the request body
 */
export const createNote = async (req, res) => {
    const { title, description } = req.body;

    // authenticate the user using the token from the cookie
    const token = req.cookies.token;
    const user = jwt.verify(token, process.env.JWT_SECRET);

    req.user = user; 

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
}

/**
 * @Controller for fetching all notes
 * @route GET /api/notes
 * @description Get all notes
 */
export const getNotes = async (req, res) => {

    // authenticate the user using the token from the cookie
    const token = req.cookies.token;
    const user = JSON.parse(token);

    req.user = user; 

    const notes = await NoteModel.find({
        user: req.user.email
    });

    // send the success response with the notes data
    return res.status(200).json({
        message: "Notes fetched successfully",
        notes
    });

}

/**
 * @Controller for updating a note by id
 * @route PATCH /api/notes/:id
 * @description Update a note by id require description in the request body
 */
export const updateNote = async (req, res) => {
    const { id } = req.params;
    const { description } = req.body;

    // Check if the provided ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid note ID" });
    }

    if (!description) {
        return res.status(400).json({ error: "Description is required" });
    }

    if (description.trim().length < 10) {
        return res.status(400).json({ error: "Description must be at least 10 characters long" });
    }

    const note = await NoteModel.findById(id);

    if (!note) {
        return res.status(404).json({ error: "Note not found" });
    }

    // Edit the note description
    note.description = description;
    await note.save();

    // Send the success response with the updated note data
    return res.status(200).json({
        message: "Note updated successfully",
        note
    });
}

/**
 * @Controller for deleting a note by id
 * @route DELETE /api/notes/:id
 * @description Delete a note by id
 */
export const deleteNote = async (req, res) => {

    const { id } = req.params;

    // Check if id is valid mongoose ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid note ID" });
    }

    // Check if the note exists
    const note = await NoteModel.findById(id);

    if (!note) {
        return res.status(404).json({ error: "Note not found" });
    }

    // If the note exists, delete it
    await NoteModel.findByIdAndDelete(id);

    return res.status(200).json({
        message: "Note deleted successfully"
    });

}
