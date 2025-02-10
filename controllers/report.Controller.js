import Report from "../models/reportModel.js";
import Cadet from "../models/cadetModel.js";
import ApiResponse from "../utils/ApiResponse.js";
import createError from "http-errors";
import asyncHandler from "express-async-handler";

// Create Report (Admin Only)
const createReport = asyncHandler(async (req, res, next) => {

    const { cadetId, performance, remarks } = req.body;
    const { _id: adminId, role } = req.user;

    if (role !== "admin") {
        return next(createError(403, "Only admins can generate reports."));
    }

    const cadet = await Cadet.findById(cadetId);
    if (!cadet) {
        return next(createError(404, "Cadet not found."));
    }

    const report = await Report.create({
        cadetId,
        performance,
        remarks,
        generatedBy: adminId,
    });

    res.status(201).json(new ApiResponse(report, "Report generated successfully."));
});

//  Get All Reports (Admin Only)
const getAllReports = asyncHandler(async (req, res, next) => {
    const reports = await Report.find().populate("cadetId", "name rank regNo").populate("generatedBy", "name email");

    if (reports.length === 0) {
        return next(createError(404, "No reports found."));
    }

    res.status(200).json(new ApiResponse(reports, "All reports retrieved successfully."));
});

// Get Report by Cadet ID (Admin & Cadet)
const getReportByCadetId = asyncHandler(async (req, res, next) => {
    const { cadetId } = req.params;
    const { _id: userId, role } = req.user;

    if (role === "user" && userId.toString() !== cadetId) {
        return next(createError(403, "You can only view your own report."));
    }

    const report = await Report.findOne({ cadetId }).populate("cadetId", "name rank regNo").populate("generatedBy", "name email");

    if (!report) {
        return next(createError(404, "Report not found."));
    }

    res.status(200).json(new ApiResponse(report, "Report retrieved successfully."));
});

// Update Report (Admin Only)
const updateReport = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { performance, remarks } = req.body;
    const { role } = req.user;

    if (role !== "admin") {
        return next(createError(403, "Only admins can update reports."));
    }

    const report = await Report.findByIdAndUpdate(id, { performance, remarks }, { new: true });

    if (!report) {
        return next(createError(404, "Report not found."));
    }

    res.status(200).json(new ApiResponse(report, "Report updated successfully."));
});

// Delete Report (Admin Only)
const deleteReport = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { role } = req.user;

    const report = await Report.findById(id);
    if (!report) {
        return next(createError(404, "Report not found."));
    }

    await report.deleteOne();
    res.status(200).json(new ApiResponse(null, "Report deleted successfully."));
});

export { createReport, getAllReports, getReportByCadetId, updateReport, deleteReport };
