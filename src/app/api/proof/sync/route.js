import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Testimonial from "@/models/Testimonial";
import CaseStudy from "@/models/CaseStudy";

export async function GET(request) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const type = searchParams.get("type");

  const filter = { status: "published" };
  if (type && type !== "all") filter.type = type;

  const [testimonials, caseStudies] = await Promise.all([
    Testimonial.find(filter)
      .sort({ featured: -1, conversions: -1, createdAt: -1 })
      .limit(limit)
      .select("studentName type content mediaUrl tags resultAmount resultDescription featured")
      .lean(),
    CaseStudy.find({ status: "published" })
      .sort({ featured: -1, createdAt: -1 })
      .limit(limit)
      .select("title studentName description challenge solution results tags featured")
      .lean(),
  ]);

  return NextResponse.json({
    testimonials,
    caseStudies,
    syncedAt: new Date().toISOString(),
  });
}
