import mongoose from "mongoose";

const TestimonialSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      default: null,
    },
    studentName: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ["video", "text", "screenshot"],
      required: true,
    },
    content: { type: String, default: "" },
    mediaUrl: { type: String, default: "" },
    tags: [
      {
        type: String,
        enum: ["earnings", "projects", "placement", "skill", "transformation"],
      },
    ],
    resultAmount: { type: Number, default: 0 },
    resultDescription: { type: String, default: "" },
    platform: {
      type: String,
      enum: ["whatsapp", "instagram", "linkedin", "twitter", "direct", "other"],
      default: "direct",
    },
    status: {
      type: String,
      enum: ["pending", "approved", "published"],
      default: "pending",
    },
    featured: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
    conversions: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

TestimonialSchema.index({ status: 1 });
TestimonialSchema.index({ tags: 1 });
TestimonialSchema.index({ studentId: 1 });

export default mongoose.models.Testimonial ||
  mongoose.model("Testimonial", TestimonialSchema);
