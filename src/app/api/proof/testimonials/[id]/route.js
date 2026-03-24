import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Testimonial from "@/models/Testimonial";

export async function GET(request, { params }) {
  await dbConnect();
  const { id } = await params;
  const testimonial = await Testimonial.findById(id)
    .populate("studentId", "name")
    .lean();
  if (!testimonial) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(testimonial);
}

export async function PUT(request, { params }) {
  await dbConnect();
  const { id } = await params;
  const body = await request.json();
  const testimonial = await Testimonial.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true,
  }).lean();
  if (!testimonial) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(testimonial);
}

export async function DELETE(request, { params }) {
  await dbConnect();
  const { id } = await params;
  const testimonial = await Testimonial.findByIdAndDelete(id);
  if (!testimonial) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ deleted: true });
}
