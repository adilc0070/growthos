import mongoose from "mongoose";

const ObjectionTemplateSchema = new mongoose.Schema(
  {
    objection: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ["Price", "Timing", "Trust", "Competition", "General"],
      default: "General",
    },
    response: { type: String, required: true },
    tips: { type: String, default: "" },
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.ObjectionTemplate ||
  mongoose.model("ObjectionTemplate", ObjectionTemplateSchema);
