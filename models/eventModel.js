import mongoose from "mongoose";
import userModel from "./userModel.js";

const EventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true

  },
  date: {
    type: Date,
    required: true

  },
  location: {
    type: String,
    required: true

  },
  description: {
    type: String

  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "userModel",
    required: true

  }, // Only Admins
}, { timestamps: true });

export default mongoose.model("Event", EventSchema);
