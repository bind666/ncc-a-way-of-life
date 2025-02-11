import mongoose from "mongoose";

const ExamSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    date: {
        type: Date,
        required: true
    },
    totalMarks: {
        type: Number,
        required: true
    },
    passingMarks: {
        type: Number,
        required: true
    },
    duration: {
        type: Number, // Duration in minutes
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userModel", // Admin (Teacher)
        required: true
    },
}, { timestamps: true });

export default mongoose.model("Exam", ExamSchema);
