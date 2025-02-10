import mongoose from "mongoose";

const AttendanceSchema = new mongoose.Schema({
  cadetId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cadet",
    required: true

  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    
  },
  status: {
    type: String,
    enum: ["present", "absent"],
    required: true

  },
  date: {
    type: Date,
    required: true

  },
  markedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "userModel",
    required: true

  }, // Only Admin
}, { timestamps: true });

export default mongoose.model("Attendance", AttendanceSchema);

