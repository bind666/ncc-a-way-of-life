import createError from "http-errors";
import userModel from "../models/userModel.js";
import { checkTokenExpiry, verifyToken } from "../utils/utils.js";
import asyncHandler from "express-async-handler";
import cadetModel from "../models/cadetModel.js";

const auth = asyncHandler(async (req, res, next) => {
    const { accessToken: accessToken } = req.cookies

    if (!accessToken) {
        return next(createError(422, "Tokens required."))
    }

    const isValid = await verifyToken(accessToken);
    if (!isValid) {
        return next(createError(422, "invalid tokens."))
    }

    const isExpire = checkTokenExpiry(isValid.exp)
    if (isExpire) {
        return next(createError(401, "Token expired."))
    }

    const user = await userModel.findOne({ email: isValid.email, accessToken }) || await cadetModel.findOne({ email: isValid.email, accessToken })
    
    if (!user) {
        return next(createError(422, "invalid user."))
    }

    req.user = user;
    next()
})

const isAdmin = asyncHandler(async (req, res, next) => {
    // const user = await userModel.findById(req.user._id);
    // console.log(req.user.role);
    const user = req.user

    if (user.role !== "admin") {
        return next(createError(403, "Access denied, Admin only."))
    }

    next()
})

export { auth, isAdmin };