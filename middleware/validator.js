import createError from "http-errors";
import joi from "joi";

// ✅ Validate RegisterUser
const validateRegisterUser = (req, res, next) => {
    const validationSchema = joi.object({
        fullName: joi.string().required().trim().min(3).disallow(""),
        email: joi.string().required().email().disallow(""),
        password: joi.string().required().min(3).max(16),
        role: joi.string().default("user")
    })

    const { error, value } = validationSchema.validate(req.body);
    if (error) {
        return next(createError(422, error.message))
    }
    req.body = value;
    next();
}

// ✅ Validate LoginUser
const validateLoginUser = (req, res, next) => {
    const validationSchema = joi.object({
        password: joi.string().required().min(3).max(16),
        email: joi.string().required().email().disallow("")
    })

    const { error, value } = validationSchema.validate(req.body);
    if (error) {
        return next(createError(422, error.message))
    }
    req.body = value;
    next();
}

// ✅ Validate CadetDetails 
const validateCadetDetails = (req, res, next) => {
    const validationSchema = joi.object({
        name: joi.string().required().trim().min(3).disallow(""),
        rank: joi.string().required().trim().disallow(""),
        email: joi.string().required().email().disallow(""),
        regNo: joi.string().required().trim().disallow(""),
        unit: joi.string().required().trim().disallow(""),
        progress: joi.array().items(joi.string()).default([]),
    });

    const { error, value } = validationSchema.validate(req.body);
    if (error) {
        return next(createError(422, error.message));
    }
    req.body = value;
    next();
};

// ✅ Validate EventDetails
const validateEventDetails = (req, res, next) => {
    const validationSchema = joi.object({
        title: joi.string().required().trim().min(3).disallow(""),
        date: joi.date().required(),
        location: joi.string().required().trim().disallow(""),
        description: joi.string().trim().allow(""),
    });

    const { error, value } = validationSchema.validate(req.body);
    if (error) {
        return next(createError(422, error.message));
    }
    req.body = value;
    next();
};

// ✅ Validate Mark Attendance 
const validateMarkAttendance = (req, res, next) => {
    const schema = joi.object({
        cadetId: joi.string().required().trim().message("Cadet ID is required."),
        eventId: joi.string().optional().allow("").trim(),
        status: joi.string().valid("present", "absent").required().messages({
            "any.only": "Status must be 'Present' or 'Absent'.",
            "string.empty": "Status is required."
        }),
        date: joi.date().required().messages({
            "date.base": "Invalid date format.",
            "any.required": "Date is required."
        })
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
        return next(createError(422, error.message));
    }

    req.body = value;
    next();
};

// ✅ Validate Update Attendance 
const validateUpdateAttendance = (req, res, next) => {
    const schema = joi.object({
        status: joi.string().valid("present", "absent").required().messages({
            "any.only": "Status must be 'Present' or 'Absent'.",
            "string.empty": "Status is required."
        })
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
        return next(createError(422, error.message));
    }

    req.body = value;
    next();
};

// ✅ Validate Get Attendance by Date 
const validateGetAttendanceByDate = (req, res, next) => {
    const schema = joi.object({
        date: joi.date().required().messages({
            "date.base": "Invalid date format.",
            "any.required": "Date is required."
        })
    });

    const { error, value } = schema.validate(req.params);
    if (error) {
        return next(createError(422, error.message));
    }

    req.params = value;
    next();
};

// ✅ Middleware to validate Report details
const validateReportDetails = (req, res, next) => {
    const validationSchema = joi.object({
        cadetId: joi.string().required().trim().regex(/^[0-9a-fA-F]{24}$/).messages({
            "string.pattern.base": "Invalid cadetId format",
            "any.required": "Cadet ID is required",
            "string.empty": "Cadet ID cannot be empty"
        }),
        performance: joi.string().required().trim().min(5).max(200).messages({
            "string.empty": "Performance details cannot be empty",
            "string.min": "Performance must be at least 5 characters",
            "string.max": "Performance cannot exceed 200 characters",
            "any.required": "Performance details are required"
        }),
        remarks: joi.string().optional().allow("").max(200).messages({
            "string.max": "Remarks cannot exceed 200 characters"
        }),
        generatedBy: joi.string().required().trim().regex(/^[0-9a-fA-F]{24}$/).messages({
            "string.pattern.base": "Invalid generatedBy ID format",
            "any.required": "GeneratedBy ID is required",
            "string.empty": "GeneratedBy ID cannot be empty"
        })
    });

    const { error, value } = validationSchema.validate(req.body, { abortEarly: false });

    if (error) {
        return next(createError(422, error.details.map((err) => err.message).join(", ")));
    }

    req.body = value;
    next();
};

// ✅ Validation for Exam Details
const validateExamDetails = (req, res, next) => {
    const validationSchema = joi.object({
        title: joi.string().required().trim().min(3).max(100),
        description: joi.string().allow("").trim().max(500),
        date: joi.date().iso().required(),
        totalMarks: joi.number().required().min(1).max(1000),
        passingMarks: joi.number().required().min(1).max(joi.ref('totalMarks')),
        duration: joi.number().required().min(1).max(300)
    });

    const { error, value } = validationSchema.validate(req.body);
    if (error) {
        return next(createError(422, error.details[0].message));
    }
    req.body = value;
    
    next();
};

// ✅ Validation for Update Exam Details
const validateUpdateExam = (req, res, next) => {
    const validationSchema = joi.object({
        title: joi.string().trim().min(3).max(100),
        description: joi.string().allow("").trim().max(500),
        date: joi.date().iso(),
        totalMarks: joi.number().min(1).max(1000),
        passingMarks: joi.number().min(1).max(1000),
        duration: joi.number().min(1).max(300)
    }).min(1); // Ensures at least one field is provided for update

    const { error, value } = validationSchema.validate(req.body);
    if (error) {
        return next(createError(422, error.details[0].message));
    }
    req.body = value;
    next();
};

export {
    validateRegisterUser,
    validateLoginUser,
    validateCadetDetails,
    validateEventDetails,
    validateMarkAttendance,
    validateUpdateAttendance,
    validateGetAttendanceByDate,
    validateReportDetails,
    validateExamDetails,
    validateUpdateExam
};