import express from "express";
import { createResult, getAllResults, getCadetResults, updateResult, deleteResult } from "../controllers/result.Controller.js";
import { isAdmin, auth } from "../middleware/auth.js";

const resultRouter = express.Router();

// Create a new result (Admin only)
resultRouter.route("/").post(auth, isAdmin, createResult);

// Get all results (Admin only)
resultRouter.route("/").get(auth, isAdmin, getAllResults);

// Get results for a specific cadet (Cadet/Admin)
resultRouter.route("/:cadetId").get(auth, getCadetResults);

// Update result (Admin only)
resultRouter.route("/:id").put(auth, isAdmin, updateResult);

// Delete result (Admin only)
resultRouter.route("/:id").delete(auth, isAdmin, deleteResult);

export default resultRouter;
