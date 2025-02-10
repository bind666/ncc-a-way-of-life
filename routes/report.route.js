import express from "express";
import {
    createReport,
    getAllReports,
    getReportByCadetId,
    updateReport,
    deleteReport
} from "../controllers/report.Controller.js";
import { isAdmin, auth } from "../middleware/auth.js";
import { validateReportDetails } from "../middleware/validator.js";

const Reportrouter = express.Router();

// Create a new report (Admin Only)
Reportrouter.route("/create").post(auth, isAdmin, validateReportDetails, createReport);

// Get all reports (Admin Only)
Reportrouter.route("/").get(auth, isAdmin, getAllReports);

// Get report by cadet ID (Admin & Student)
Reportrouter.route("/cadet/:cadetId").get(auth, getReportByCadetId);

// Update report (Admin Only)
Reportrouter.route("/update/:id").patch(auth, isAdmin, validateReportDetails, updateReport);

// Delete report (Admin Only)
Reportrouter.route("/delete/:id").delete(auth, isAdmin, deleteReport);

export default Reportrouter;
