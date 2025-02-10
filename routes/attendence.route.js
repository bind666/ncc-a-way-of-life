import express from "express";
import {
    markAttendance,
    updateAttendance,
    getAllAttendance,
    getCadetAttendance,
    getAttendanceByDate,
    deleteAttendance
} from "../controllers/attendence.Controller.js";
import { auth, isAdmin } from "../middleware/auth.js";
import { validateMarkAttendance, validateUpdateAttendance, validateGetAttendanceByDate } from "../middleware/validator.js";

const attendenceRouter = express.Router();

// ✅ Mark Attendance (Admin Only)
attendenceRouter.route("/mark").post(validateMarkAttendance, auth, isAdmin, markAttendance)

// ✅ Update Attendance (Admin Only)
attendenceRouter.route("/update/:id").put(validateUpdateAttendance, auth, isAdmin, updateAttendance);

// ✅ Get All Attendance Records (Admin Only)
attendenceRouter.route("/").get(auth, isAdmin, getAllAttendance);

// ✅ Get Attendance for a Specific Cadet (Admin & Student)
attendenceRouter.route("/cadet/:cadetId").get(auth, getCadetAttendance);

// ✅ Get Attendance for a Specific Date (Admin Only)
attendenceRouter.route("/date/:date").get(validateGetAttendanceByDate, auth, isAdmin, getAttendanceByDate);

// ✅ Delete Attendance Record (Admin Only)
attendenceRouter.route("/delete/:id").delete(auth, isAdmin, deleteAttendance);

export default attendenceRouter;
