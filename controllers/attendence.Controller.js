import Attendance from "../models/attendenceModel.js";
import Cadet from "../models/cadetModel.js";
import Event from "../models/eventModel.js";
import ApiResponse from "../utils/ApiResponse.js";
import createError from "http-errors";
import asyncHandler from "express-async-handler";

// Mark Attendance (Admin Only)
const markAttendance = asyncHandler(async (req, res, next) => {
    const { cadetId, eventId, status, date } = req.body;
    
    // if (!cadetId || !status || !date) {
    //     return next(createError(400, "Cadet ID, status, and date are required"));
    // }

    const cadetExists = await Cadet.findById(cadetId);
    if (!cadetExists) {
        return next(createError(404, "Cadet not found"));
    }

    if (eventId) {
        const eventExists = await Event.findById(eventId);
        if (!eventExists) {
            return next(createError(404, "Event not found"));
        }
    }

    const attendanceExists = await Attendance.findOne({ cadetId, date });
    if (attendanceExists) {
        return next(createError(409, "Attendance already marked for this date"));
    }

    const attendance = await Attendance.create({
        cadetId,
        eventId: eventId || null,
        status,
        date,
        markedBy: req.user._id
    });

    res.status(201).json(new ApiResponse(attendance, "Attendance marked successfully"));
});

// Update Attendance (Admin Only)
const updateAttendance = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { status } = req.body;

    const attendance = await Attendance.findById(id);
    if (!attendance) {
        return next(createError(404, "Attendance record not found"));
    }

    attendance.status = status;
    await attendance.save();

    res.status(200).json(new ApiResponse(attendance, "Attendance updated successfully"));
});

// Get All Attendance Records (Admin Only)
const getAllAttendance = asyncHandler(async (req, res, next) => {
    const attendanceRecords = await Attendance.find()
        .populate("cadetId", "name rank regNo unit")
        .populate("eventId", "title date location")
        .populate("markedBy", "fullName email");

    if (attendanceRecords.length === 0) {
        return next(createError(404, "No attendance records found"));
    }

    res.status(200).json(new ApiResponse(attendanceRecords, "Attendance records fetched successfully"));
});

// Get Attendance for a Specific Cadet (Admin & Student)
const getCadetAttendance = asyncHandler(async (req, res, next) => {
    const { cadetId } = req.params;

    const attendanceRecords = await Attendance.find({ cadetId })
        .populate("eventId", "title date location")
        .populate("markedBy", "fullName email");

    if (attendanceRecords.length === 0) {
        return next(createError(404, "No attendance records found for this cadet"));
    }

    res.status(200).json(new ApiResponse(attendanceRecords, "Cadet attendance records fetched successfully"));
});

// Get Attendance for a Specific Date (Admin Only)
const getAttendanceByDate = asyncHandler(async (req, res, next) => {
    const { date } = req.params;

    const attendanceRecords = await Attendance.find({ date })
        .populate("cadetId", "name rank regNo unit")
        .populate("eventId", "title date location")
        .populate("markedBy", "fullName email");

    if (attendanceRecords.length === 0) {
        return next(createError(404, "No attendance records found for this date"));
    }

    res.status(200).json(new ApiResponse(attendanceRecords, "Attendance records for the given date fetched successfully"));
});

// Delete Attendance Record (Admin Only)
const deleteAttendance = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const attendance = await Attendance.findById(id);
    if (!attendance) {
        return next(createError(404, "Attendance record not found"));
    }

    await attendance.deleteOne();
    res.status(200).json(new ApiResponse(null, "Attendance record deleted successfully"));
});

export { markAttendance, updateAttendance, getAllAttendance, getCadetAttendance, getAttendanceByDate, deleteAttendance };
