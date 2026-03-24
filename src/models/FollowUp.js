import mongoose from "mongoose";

const FollowUpSchema = new mongoose.Schema(
  {
    leadId: { type: mongoose.Schema.Types.ObjectId, ref: "Lead", required: true },
    leadName: { type: String, required: true },
    leadPhone: { type: String, required: true },
    sequenceDay: {
      type: Number,
      enum: [1, 3, 5, 7, 0],
      default: 0,
    },
    scheduledDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["pending", "completed", "skipped"],
      default: "pending",
    },
    method: {
      type: String,
      enum: ["call", "whatsapp", "email"],
      default: "whatsapp",
    },
    scriptId: { type: mongoose.Schema.Types.ObjectId, ref: "SalesScript", default: null },
    notes: { type: String, default: "" },
    completedAt: { type: Date, default: null },
    salesperson: { type: String, default: "" },
  },
  { timestamps: true }
);

FollowUpSchema.index({ leadId: 1 });
FollowUpSchema.index({ scheduledDate: 1, status: 1 });

export default mongoose.models.FollowUp ||
  mongoose.model("FollowUp", FollowUpSchema);
