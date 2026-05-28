import express from "express";
import { createNote, getNotes, updateNote, deleteNote } from "../controllers/notes.controller.js";

const router = express.Router();

/**
 * @route POST /api/notes
 * @description Create a new note need title and description in the request body
 * @access Public
 */
router.post("/", createNote);

/**
 * @route GET /api/notes
 * @description Get all notes
 * @access Public
 */
router.get("/", getNotes);

/**
 * @route PATCH /api/notes/:id
 * @description Update a note by id require description in the request body
 * @access Public
 */
router.patch("/:id", updateNote);

/**
 * @route DELETE /api/notes/:id
 * @description Delete a note by id
 * @access Public
 */
router.delete("/:id", deleteNote);

export default router;
