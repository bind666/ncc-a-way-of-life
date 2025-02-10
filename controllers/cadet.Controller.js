import Cadet from "../models/cadetModel.js";
import ApiResponse from "../utils/ApiResponse.js"
import asyncHandler from "express-async-handler";
import createError from "http-errors";

// Admin: Add Cadet 
const addCadet = asyncHandler(async (req, res, next) => {

    const { name, rank, email, regNo, unit, progress } = req.body;
    const { _id } = req.user;
    const password = email
    console.log(password);
    

    const existingCadet = await Cadet.findOne({ regNo });
    if (existingCadet) {
        return next(createError(409, "Cadet with this RegNo already exists."));
    }

    const cadet = await Cadet.create({
        name,
        rank,
        email,
        password,
        regNo,
        unit,
        progress,
        createdBy: req.user._id,
    })

    res.status(201).json(new ApiResponse(cadet, "Cadet added successfully."));

});


const updateCadet = asyncHandler(async (req, res, next) => {

    // if (req.user.role !== "admin") {
    //     return next(createError(403, "Only admins can update cadet details."));
    // }
    const { id } = req.params;
    const { name, rank, unit, progress } = req.body;

    const cadet = await Cadet.findById(id);
    if (!cadet) {
        return next(createError(404, "Cadet not found."));
    }

    cadet.name = name || cadet.name;
    cadet.rank = rank || cadet.rank;
    cadet.unit = unit || cadet.unit;
    cadet.progress = progress || cadet.progress;

    await cadet.save();

    res.status(200).json(new ApiResponse(cadet, "Cadet updated successfully."));
});

// Admin: Delete a cadet
const deleteCadet = asyncHandler(async (req, res, next) => {

    const { id } = req.params;

    const cadet = await Cadet.findById(id);
    if (!cadet) {
        return next(createError(404, "Cadet not found."));
    }

    await cadet.deleteOne();
    res.status(200).json(new ApiResponse(null, "Cadet deleted successfully."));
});

// Admin: Fetch all cadets
const getAllCadets = asyncHandler(async (req, res, next) => {

    if (req.user.role !== "admin") {
        return next(createError(403, "Only admins can view all cadets."));
    }

    const cadets = await Cadet.find();
    res.status(200).json(new ApiResponse(cadets, "Cadets fetched successfully."));
});

// User: View their own cadet details
const getCadetDetails = asyncHandler(async (req, res, next) => {

    const cadet = await Cadet.findOne({ _id: req.user._id });
    // console.log(cadet);

    // console.log(req.user._id);


    if (!cadet) {
        return next(createError(404, "Cadet details not found."));
    }

    res.status(200).json(new ApiResponse(cadet, "Cadet details fetched."));
});

export { addCadet, updateCadet, deleteCadet, getAllCadets, getCadetDetails };