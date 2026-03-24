import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Testimonial from "@/models/Testimonial";

export async function GET(request) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const status = searchParams.get("status");
  const tag = searchParams.get("tag");
  const featured = searchParams.get("featured");

  const filter = {};
  if (type && type !== "all") filter.type = type;
  if (status && status !== "all") filter.status = status;
  if (tag && tag !== "all") filter.tags = tag;
  if (featured === "true") filter.featured = true;

  const testimonials = await Testimonial.find(filter)
    .populate("studentId", "name")
    .sort({ createdAt: -1 })
    .lean();
  return NextResponse.json(testimonials);
}

export async function POST(request) {
  await dbConnect();
  const body = await request.json();

  if (!body.studentName || !body.type) {
    return NextResponse.json(
      { error: "studentName and type are required" },
      { status: 400 }
    );
  }

  const testimonial = await Testimonial.create(body);
  return NextResponse.json(testimonial, { status: 201 });
}
