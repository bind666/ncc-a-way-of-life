import mongoose from "mongoose";

const ResultSchema = new mongoose.Schema({
    cadetId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cadet",
        required: true
    },
    examId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Exam",
        required: true
    },
    score: {
        type: Number,
        required: true,
        min: 0
    },
    totalMarks: {
        type: Number,
        required: true
    },
    percentage: {
        type: Number,
        required: true
    },
    grade: {
        type: String,
        enum: ["A", "B", "C", "D", "F"],
        required: true
    },
    remarks: {
        type: String,
        enum: ["Pass", "Fail"],
        required: true
    },
    generatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userModel",
        required: true
    } // Only Admin
}, { timestamps: true });

export default mongoose.model("Result", ResultSchema);
