import mongoose from "mongoose";

const SalesScriptSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ["Introduction", "Follow-up", "Closing", "Objection Handling", "General"],
      default: "General",
    },
    content: { type: String, required: true },
    tags: [{ type: String, trim: true }],
    whatsappReady: { type: Boolean, default: false },
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.SalesScript ||
  mongoose.model("SalesScript", SalesScriptSchema);
