import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Testimonial from "@/models/Testimonial";

const SEED = [
  {
    studentName: "Rahul Sharma",
    type: "text",
    content:
      "I earned my first ₹25,000 freelancing within 3 weeks of completing the course. The practical approach made all the difference!",
    tags: ["earnings", "transformation"],
    resultAmount: 25000,
    resultDescription: "First freelancing income in 3 weeks",
    platform: "whatsapp",
    status: "published",
    featured: true,
    views: 342,
    clicks: 48,
    conversions: 12,
  },
  {
    studentName: "Priya Patel",
    type: "video",
    content:
      "Video testimonial about landing a full-time remote job after completing the program.",
    mediaUrl: "https://example.com/testimonials/priya-video.mp4",
    tags: ["placement", "transformation"],
    resultAmount: 50000,
    resultDescription: "Landed remote job at ₹50K/month",
    platform: "instagram",
    status: "published",
    featured: true,
    views: 1250,
    clicks: 185,
    conversions: 34,
  },
  {
    studentName: "Amit Kumar",
    type: "screenshot",
    content: "Payment screenshot from Upwork — first international client project.",
    mediaUrl: "https://example.com/testimonials/amit-screenshot.png",
    tags: ["earnings", "projects"],
    resultAmount: 15000,
    resultDescription: "First Upwork project completed",
    platform: "direct",
    status: "approved",
    views: 89,
    clicks: 12,
    conversions: 3,
  },
  {
    studentName: "Sneha Gupta",
    type: "text",
    content:
      "Went from zero coding knowledge to building 3 live projects in 2 months. Now I have a portfolio that actually gets me interviews!",
    tags: ["projects", "skill"],
    resultAmount: 0,
    resultDescription: "3 live projects in portfolio",
    platform: "linkedin",
    status: "published",
    views: 567,
    clicks: 73,
    conversions: 18,
  },
  {
    studentName: "Vikram Singh",
    type: "text",
    content:
      "The community support is incredible. Got my doubts cleared within hours and finished assignments on time every week.",
    tags: ["transformation"],
    resultAmount: 0,
    resultDescription: "Consistent weekly progress",
    platform: "whatsapp",
    status: "pending",
    views: 0,
    clicks: 0,
    conversions: 0,
  },
  {
    studentName: "Deepika Reddy",
    type: "video",
    content: "From homemaker to freelancer — earned ₹1.2L in first 3 months.",
    mediaUrl: "https://example.com/testimonials/deepika-video.mp4",
    tags: ["earnings", "transformation"],
    resultAmount: 120000,
    resultDescription: "₹1.2L earned in 3 months",
    platform: "instagram",
    status: "published",
    featured: true,
    views: 2100,
    clicks: 310,
    conversions: 56,
  },
];

export async function POST() {
  await dbConnect();
  const existing = await Testimonial.countDocuments();
  if (existing > 0) {
    return NextResponse.json({
      seeded: false,
      message: "Testimonials already exist. Delete them first to re-seed.",
    });
  }
  await Testimonial.insertMany(SEED);
  return NextResponse.json({ seeded: true, count: SEED.length });
}
