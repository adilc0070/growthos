import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import CaseStudy from "@/models/CaseStudy";

export async function GET(request) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const featured = searchParams.get("featured");

  const filter = {};
  if (status && status !== "all") filter.status = status;
  if (featured === "true") filter.featured = true;

  const studies = await CaseStudy.find(filter)
    .populate("testimonials")
    .sort({ createdAt: -1 })
    .lean();
  return NextResponse.json(studies);
}

export async function POST(request) {
  await dbConnect();
  const body = await request.json();

  if (!body.title || !body.studentName) {
    return NextResponse.json(
      { error: "title and studentName are required" },
      { status: 400 }
    );
  }

  const study = await CaseStudy.create(body);
  return NextResponse.json(study, { status: 201 });
}
