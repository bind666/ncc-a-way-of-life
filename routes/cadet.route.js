import express from 'express'
import { auth } from '../middleware/auth.js'
import { isAdmin } from '../middleware/auth.js'
import {validateCadetDetails} from '../middleware/validator.js';
import { addCadet, deleteCadet, getAllCadets, getCadetDetails, updateCadet } from '../controllers/cadet.Controller.js';

const cadetRouter = express.Router();

cadetRouter.route("/create").post(validateCadetDetails, auth, isAdmin, addCadet)
cadetRouter.route("/update/:id").patch( auth, isAdmin, updateCadet)
cadetRouter.route("/delete/:id").delete(auth, isAdmin, deleteCadet)
cadetRouter.route("/fetchcadet").post(auth, isAdmin, getAllCadets)


cadetRouter.route("/mycadet").post(auth, getCadetDetails)

export default cadetRouter