import mongoose from "mongoose";

const CallLogSchema = new mongoose.Schema(
  {
    leadId: { type: mongoose.Schema.Types.ObjectId, ref: "Lead", required: true },
    leadName: { type: String, required: true },
    leadPhone: { type: String, required: true },
    type: {
      type: String,
      enum: ["call", "whatsapp", "voicenote"],
      default: "call",
    },
    direction: {
      type: String,
      enum: ["inbound", "outbound"],
      default: "outbound",
    },
    duration: { type: Number, default: 0 },
    outcome: {
      type: String,
      enum: ["connected", "no_answer", "busy", "voicemail", "completed"],
      default: "connected",
    },
    notes: { type: String, default: "" },
    salesperson: { type: String, default: "" },
  },
  { timestamps: true }
);

CallLogSchema.index({ leadId: 1 });

export default mongoose.models.CallLog ||
  mongoose.model("CallLog", CallLogSchema);
