import Event from "../models/eventModel.js";
import ApiResponse from "../utils/ApiResponse.js";
import createError from "http-errors";
import asyncHandler from "express-async-handler";

// Create an Event
const createEvent = asyncHandler(async (req, res, next) => {
    
    const { title, description, date, location } = req.body;

    if (!title || !date || !location) {
        return next(createError(422, "Title, Date, and Location are required."));
    }

    const event = await Event.create({
        title,
        description,
        date,
        location,
        createdBy: req.user._id,
    });

    res.status(201).json(new ApiResponse(event, "Event created successfully."));
});

// Update an Event
const updateEvent = asyncHandler(async (req, res, next) => {

    const { id } = req.params;
    const { title, description, date, location } = req.body;

    const event = await Event.findById(id);
    if (!event) {
        return next(createError(404, "Event not found."));
    }

    event.title = title || event.title;
    event.description = description || event.description;
    event.date = date || event.date;
    event.location = location || event.location;

    await event.save();

    res.status(200).json(new ApiResponse(event, "Event updated successfully."));
});

// Admin: Delete an Event
const deleteEvent = asyncHandler(async (req, res, next) => {

    const { id } = req.params;

    const event = await Event.findById(id);
    if (!event) {
        return next(createError(404, "Event not found."));
    }

    await event.deleteOne();
    res.status(200).json(new ApiResponse(null, "Event deleted successfully."));
});

// Admin & User: Fetch All Events
const getAllEvents = asyncHandler(async (req, res, next) => {
    const events = await Event.find();
    res.status(200).json(new ApiResponse(events, "Events fetched successfully."));
});

// User: Fetch a Single Event
const getEventById = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const event = await Event.findById(id);

    if (!event) {
        return next(createError(404, "Event not found."));
    }

    res.status(200).json(new ApiResponse(event, "Event details fetched."));
});

export { createEvent, updateEvent, deleteEvent, getAllEvents, getEventById };

