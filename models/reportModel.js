import mongoose from "mongoose";

const ReportSchema = new mongoose.Schema({
  cadetId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cadet", required: true

  },
  performance: {
    type: String,
    required: true

  },
  remarks: {
    type: String

  },
  generatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "userModel",
    required: true

  }, // Only Admin
}, { timestamps: true });

export default mongoose.model("Report", ReportSchema);
