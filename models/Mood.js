import mongoose from "mongoose";

const MoodSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  feeling: {
    type: Number,
    required: true,
  },
  notes: String,
});

export default mongoose.models.Mood || mongoose.model("Mood", MoodSchema);
