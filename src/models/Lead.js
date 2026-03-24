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

const QualificationSchema = new mongoose.Schema(
  {
    currentSituation: { type: String, default: "" },
    goal: { type: String, default: "" },
    timeline: {
      type: String,
      enum: ["immediate", "1_month", "3_months", "6_months", "exploring"],
      default: "exploring",
    },
    budgetRange: {
      type: String,
      enum: ["below_10k", "10k_20k", "20k_30k", "30k_50k", "above_50k"],
      default: "below_10k",
    },
    previousExperience: { type: String, default: "" },
    commitment: {
      type: String,
      enum: ["full_time", "part_time", "weekends", "unsure"],
      default: "unsure",
    },
    qualifiedAt: { type: Date, default: null },
  },
  { _id: false }
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
    adSource: {
      type: String,
      enum: [
        "facebook_ads", "google_ads", "instagram_ads", "youtube_ads",
        "linkedin_ads", "twitter_ads", "other_ads",
        "organic_search", "organic_social", "blog", "youtube_organic",
        "referral_student", "referral_affiliate", "referral_partner",
        "direct", "",
      ],
      default: "",
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
    persona: {
      type: String,
      enum: ["student", "job_seeker", "freelancer", "working_professional", "business_owner", ""],
      default: "",
    },
    urgency: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "low",
    },
    engagement: {
      type: String,
      enum: ["none", "low", "medium", "high"],
      default: "none",
    },
    leadScore: { type: Number, default: 0, min: 0, max: 100 },
    temperature: {
      type: String,
      enum: ["cold", "warm", "hot"],
      default: "cold",
    },
    qualificationData: { type: QualificationSchema, default: () => ({}) },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export default mongoose.models.Lead || mongoose.model("Lead", LeadSchema);
