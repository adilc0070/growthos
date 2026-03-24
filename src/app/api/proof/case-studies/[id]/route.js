import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import CaseStudy from "@/models/CaseStudy";

export async function GET(request, { params }) {
  await dbConnect();
  const { id } = await params;
  const study = await CaseStudy.findById(id)
    .populate("testimonials")
    .lean();
  if (!study) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(study);
}

export async function PUT(request, { params }) {
  await dbConnect();
  const { id } = await params;
  const body = await request.json();
  const study = await CaseStudy.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true,
  }).lean();
  if (!study) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(study);
}

export async function DELETE(request, { params }) {
  await dbConnect();
  const { id } = await params;
  const study = await CaseStudy.findByIdAndDelete(id);
  if (!study) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ deleted: true });
}
