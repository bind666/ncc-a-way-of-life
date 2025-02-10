import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true

  },
  date: {
    type: Date,
    default: Date.now

  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true

  }, // Only Admin
}, { timestamps: true });

export default mongoose.model("Notification", NotificationSchema);
