import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Course from "@/models/Course";

const SEED_COURSES = [
  {
    title: "Full-Stack Web Development",
    description: "Complete web development bootcamp covering HTML, CSS, JavaScript, React, Node.js, and MongoDB.",
    duration: 12,
    totalModules: 24,
    skills: ["HTML/CSS", "JavaScript", "React", "Node.js", "MongoDB"],
    isActive: true,
  },
  {
    title: "Freelancing Mastery",
    description: "Learn to land clients, price your services, and build a sustainable freelancing career.",
    duration: 6,
    totalModules: 12,
    skills: ["Client Acquisition", "Proposal Writing", "Pricing Strategy", "Portfolio Building"],
    isActive: true,
  },
  {
    title: "Digital Marketing Fundamentals",
    description: "Master SEO, social media marketing, email marketing, and paid advertising.",
    duration: 8,
    totalModules: 16,
    skills: ["SEO", "Social Media", "Email Marketing", "Google Ads", "Meta Ads"],
    isActive: true,
  },
];

export async function POST() {
  await dbConnect();
  const count = await Course.countDocuments();
  if (count > 0) {
    return NextResponse.json({ seeded: false, message: "Courses already exist." });
  }
  await Course.insertMany(SEED_COURSES);
  return NextResponse.json({ seeded: true, count: SEED_COURSES.length });
}
