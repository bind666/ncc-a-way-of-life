import Exam from "../models/examModel.js";
import asyncHandler from "express-async-handler";
import createError from "http-errors";
import ApiResponse from "../utils/ApiResponse.js";

// Create Exam (Admin Only)
const createExam = asyncHandler(async (req, res, next) => {

    const { title, description, date, totalMarks, passingMarks, duration } = req.body;

    const exam = await Exam.create({
        title,
        description,
        date,
        totalMarks,
        passingMarks,
        duration,
        createdBy: req.user._id
    });

    res.status(201).json(new ApiResponse(exam, "Exam created successfully."));
});

// Fetch All Exams
const getAllExams = asyncHandler(async (req, res, next) => {
    const exams = await Exam.find().populate("createdBy", "name email");

    if (!exams.length) {
        return next(createError(404, "No exams found."));
    }

    res.status(200).json(new ApiResponse(exams, "Exams fetched successfully."));
});

// Fetch Exam by ID
const getExamById = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const exam = await Exam.findById(id).populate("createdBy", "name email");

    if (!exam) {
        return next(createError(404, "Exam not found."));
    }

    res.status(200).json(new ApiResponse(exam, "Exam details fetched successfully."));
});

// Update Exam (Admin Only)
const updateExam = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { title, description, date, totalMarks, passingMarks, duration } = req.body;

    const exam = await Exam.findById(id);
    if (!exam) {
        return next(createError(404, "Exam not found."));
    }

    if (exam.createdBy.toString() !== req.user._id.toString()) {
        return next(createError(403, "Unauthorized to update this exam."));
    }

    exam.title = title || exam.title;
    exam.description = description || exam.description;
    exam.date = date || exam.date;
    exam.totalMarks = totalMarks || exam.totalMarks;
    exam.passingMarks = passingMarks || exam.passingMarks;
    exam.duration = duration || exam.duration;

    await exam.save();
    res.status(200).json(new ApiResponse(exam, "Exam updated successfully."));
});

// Delete Exam (Admin Only)
const deleteExam = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const exam = await Exam.findById(id);

    if (!exam) {
        return next(createError(404, "Exam not found."));
    }

    if (exam.createdBy.toString() !== req.user._id.toString()) {
        return next(createError(403, "Unauthorized to delete this exam."));
    }

    await exam.deleteOne();
    res.status(200).json(new ApiResponse(null, "Exam deleted successfully."));
});

export { createExam, getAllExams, getExamById, updateExam, deleteExam };
