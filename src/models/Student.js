import mongoose from "mongoose";

const SkillSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    level: { type: Number, default: 0, min: 0, max: 100 },
  },
  { _id: true }
);

const CheckInSchema = new mongoose.Schema(
  {
    notes: { type: String, default: "" },
    mood: {
      type: String,
      enum: ["great", "good", "okay", "struggling"],
      default: "good",
    },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const TimelineSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: [
        "enrolled",
        "task_completed",
        "assignment_submitted",
        "checkin",
        "earning_logged",
        "skill_updated",
        "status_change",
        "certificate_issued",
      ],
      required: true,
    },
    description: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const StudentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, trim: true, default: "" },
    phone: { type: String, trim: true, default: "" },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    enrollmentDate: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["active", "paused", "completed", "dropped"],
      default: "active",
    },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    earnings: { type: Number, default: 0 },
    firstEarningDate: { type: Date, default: null },
    skills: [SkillSchema],
    communityLinks: {
      whatsapp: { type: String, default: "" },
      discord: { type: String, default: "" },
    },
    checkIns: [CheckInSchema],
    timeline: [TimelineSchema],
    certificateIssued: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export default mongoose.models.Student ||
  mongoose.model("Student", StudentSchema);
