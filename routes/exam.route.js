import express from "express";
import { createExam, getAllExams, getExamById, updateExam, deleteExam } from "../controllers/exam.Controller.js";
import { auth, isAdmin } from "../middleware/auth.js";
import { validateExamDetails, validateUpdateExam } from "../middleware/validator.js";

const examRouter = express.Router();

// Create Exam (Admin Only)
examRouter.route("/create").post(auth, isAdmin, validateExamDetails, createExam);

// Get All Exams
examRouter.route("/").get(auth, getAllExams);

// Get Exam by ID
examRouter.route("/:id").get(auth, getExamById);

// Update Exam (Admin Only)
examRouter.route("/update/:id").put(auth, isAdmin, validateUpdateExam, updateExam);

// Delete Exam (Admin Only)
examRouter.route("/delete/:id").delete(auth, isAdmin, deleteExam);

export default examRouter;
