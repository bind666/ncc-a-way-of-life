import express from 'express'
import { auth } from '../middleware/auth.js'
import { isAdmin } from '../middleware/auth.js'
import {validateEventDetails} from '../middleware/validator.js'
import { createEvent, deleteEvent, getAllEvents, updateEvent } from '../controllers/event.controller.js';

const eventRouter = express.Router();

eventRouter.route("/create").post(validateEventDetails, auth, isAdmin, createEvent)
eventRouter.route("/update/:id").patch(auth, isAdmin, updateEvent)
eventRouter.route("/fetch").get(auth, getAllEvents)
eventRouter.route("/delete/:id").delete(auth, isAdmin, deleteEvent)

export default eventRouter