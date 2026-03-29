import mongoose from "mongoose";

const ChatMessageSchema = new mongoose.Schema(
  {
    leadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
      required: true,
      index: true,
    },
    fromMe: { type: Boolean, default: false },
    timestamp: { type: Number, required: true },
    source: { type: String, default: "" },
    body: { type: String, default: "" },
    from: { type: String, default: "" },
    to: { type: String, default: "" },
    fromName: { type: String, default: "" },
    type: {
      type: String,
      enum: ["text", "audio", "video", "voice", "image", "document","unknown","link_preview"],
      default: "text",
    },
    audioFile: { type: String, default: "" },
    forwarded: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

ChatMessageSchema.index({ leadId: 1, timestamp: 1 });

export default mongoose.models.ChatMessage ||
  mongoose.model("ChatMessage", ChatMessageSchema);
