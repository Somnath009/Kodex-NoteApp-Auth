import mongoose from "mongoose";

// Define the schema for the notes collection
const noteSchema = new mongoose.Schema({
    title: String,
    descripction: String,
})

// Create the model for the notes collection
const noteModel = mongoose.model("Note", noteSchema);

export default noteModel;