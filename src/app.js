import express from "express";
import cookie from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import notesRoutes from "./routes/notes.routes.js";

// Create an Express application
const app = express();

app.use(express.json());
app.use(cookie());

// Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/notes", notesRoutes);

export default app;
