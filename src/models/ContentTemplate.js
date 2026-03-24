import mongoose from "mongoose";

const ContentTemplateSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ["social_post", "caption", "story", "reel_script", "whatsapp_broadcast"],
      required: true,
    },
    platform: {
      type: String,
      enum: ["instagram", "linkedin", "twitter", "facebook", "whatsapp", "universal"],
      default: "universal",
    },
    template: { type: String, required: true },
    variables: [String],
    isDefault: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export default mongoose.models.ContentTemplate ||
  mongoose.model("ContentTemplate", ContentTemplateSchema);
