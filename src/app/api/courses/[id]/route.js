import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Course from "@/models/Course";

export async function GET(_req, { params }) {
  await dbConnect();
  const { id } = await params;
  const course = await Course.findById(id).lean();
  if (!course) return NextResponse.json({ error: "Course not found" }, { status: 404 });
  return NextResponse.json(course);
}

export async function PUT(request, { params }) {
  await dbConnect();
  const { id } = await params;
  const body = await request.json();
  const course = await Course.findByIdAndUpdate(id, body, { new: true, runValidators: true });
  if (!course) return NextResponse.json({ error: "Course not found" }, { status: 404 });
  return NextResponse.json(course);
}

export async function DELETE(_req, { params }) {
  await dbConnect();
  const { id } = await params;
  const course = await Course.findByIdAndDelete(id);
  if (!course) return NextResponse.json({ error: "Course not found" }, { status: 404 });
  return NextResponse.json({ success: true });
}
