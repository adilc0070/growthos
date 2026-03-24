import mongoose from "mongoose";

const NoteSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const TimelineSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: [
        "created", "status_change", "note", "edited", "follow_up",
        "call_logged", "whatsapp_sent", "sequence_started",
      ],
      required: true,
    },
    description: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const LeadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true, default: "" },
    source: {
      type: String,
      enum: ["Ads", "Organic", "Referral"],
      default: "Ads",
    },
    status: {
      type: String,
      enum: [
        "new",
        "contacted",
        "interested",
        "payment_pending",
        "converted",
        "dropped",
      ],
      default: "new",
    },
    budget: { type: String, default: "" },
    courseInterest: { type: String, default: "" },
    tags: [{ type: String, trim: true }],
    notes: [NoteSchema],
    timeline: [TimelineSchema],
    assignedTo: { type: String, trim: true, default: "" },
    followUpDate: { type: Date, default: null },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export default mongoose.models.Lead || mongoose.model("Lead", LeadSchema);
