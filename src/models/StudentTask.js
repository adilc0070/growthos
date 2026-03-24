import mongoose from "mongoose";

const SubmissionSchema = new mongoose.Schema(
  {
    content: { type: String, default: "" },
    fileUrl: { type: String, default: "" },
    submittedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const StudentTaskSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    week: { type: Number, default: 1, min: 1 },
    type: {
      type: String,
      enum: ["task", "challenge", "assignment"],
      default: "task",
    },
    status: {
      type: String,
      enum: ["pending", "in_progress", "submitted", "completed", "overdue"],
      default: "pending",
    },
    dueDate: { type: Date, default: null },
    points: { type: Number, default: 10 },
    submission: { type: SubmissionSchema, default: null },
    feedback: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.models.StudentTask ||
  mongoose.model("StudentTask", StudentTaskSchema);
