import ResultModel from "../models/resultModel.js";
import CadetModel from "../models/cadetModel.js";
import ExamModel from "../models/examModel.js";
import resultModel from "../models/resultModel.js";
import ApiResponse from "../utils/ApiResponse.js";
import createError from "http-errors";
import asyncHandler from "express-async-handler";

// Create a new result Admin Only
const createResult = asyncHandler(async (req, res, next) => {

    const { cadetId, examId, score, totalMarks } = req.body;

    if (!cadetId || !examId || score == null || totalMarks == null) {
        return next(createError(422, "All fields are required."));
    }

    const cadetExists = await CadetModel.findById(cadetId);
    const examExists = await ExamModel.findById(examId);

    if (!cadetExists || !examExists) {
        return next(createError(404, "Cadet or Exam not found."));
    }

    const resultAlreadyCreated = await resultModel.findOne({ cadetId: cadetId, examId: examId })
    if (resultAlreadyCreated) {
        return next(createError(402, "Result already creadted..."));
    }

    const percentage = ((score / totalMarks) * 100).toFixed(2);
    let grade = "F";
    let remarks = "Fail";

    if (percentage >= 90) grade = "A", remarks = "Pass";
    else if (percentage >= 75) grade = "B", remarks = "Pass";
    else if (percentage >= 60) grade = "C", remarks = "Pass";
    else if (percentage >= 50) grade = "D", remarks = "Pass";

    const result = await ResultModel.create({
        cadetId,
        examId,
        score,
        totalMarks,
        percentage,
        grade,
        remarks,
        generatedBy: req.user._id // Only admin can create results
    });

    res.status(201).json(new ApiResponse(result, "Result created successfully"));
});

// Get all results Admin Only
const getAllResults = asyncHandler(async (req, res, next) => {
    const results = await ResultModel.find().populate("cadetId", "name rank regNo")
        .populate("examId", "title date")
        .populate("generatedBy", "fullName email");

    if (!results.length) {
        return next(createError(404, "No results found."));
    }

    res.status(200).json(new ApiResponse(results, "Results fetched successfully"));
});

// Get results for a specific cadet Admin & Respective Cadet
const getCadetResults = asyncHandler(async (req, res, next) => {
    const { cadetId } = req.params;

    const results = await ResultModel.find({ cadetId })
        .populate("examId", "title date")
        .populate("generatedBy", "fullName email");

    if (!results.length) {
        return next(createError(404, "No results found for this cadet."));
    }

    res.status(200).json(new ApiResponse(results, "Results fetched successfully"));
});

// Update result (Admin Only)Admin Only
const updateResult = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { score, totalMarks } = req.body;

    if (score == null || totalMarks == null) {
        return next(createError(422, "Score and Total Marks are required."));
    }

    const percentage = ((score / totalMarks) * 100).toFixed(2);
    let grade = "F";
    let remarks = "Fail";

    if (percentage >= 90) grade = "A", remarks = "Pass";
    else if (percentage >= 75) grade = "B", remarks = "Pass";
    else if (percentage >= 60) grade = "C", remarks = "Pass";
    else if (percentage >= 50) grade = "D", remarks = "Pass";

    const result = await ResultModel.findByIdAndUpdate(id, { score, totalMarks, percentage, grade, remarks }, { new: true });

    if (!result) {
        return next(createError(404, "Result not found."));
    }

    res.status(200).json(new ApiResponse(result, "Result updated successfully"));
});

// Delete result (Admin Only) Admin Only
const deleteResult = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const result = await ResultModel.findById(id);

    if (!result) {
        return next(createError(404, "Result not found."));
    }

    await result.deleteOne();

    res.status(200).json(new ApiResponse(null, "Result deleted successfully"));
});

export { createResult, getAllResults, getCadetResults, updateResult, deleteResult };
