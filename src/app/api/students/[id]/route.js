import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Student from "@/models/Student";

export async function GET(_req, { params }) {
  await dbConnect();
  const { id } = await params;
  const student = await Student.findById(id).populate("courseId", "title").lean();
  if (!student) return NextResponse.json({ error: "Student not found" }, { status: 404 });
  return NextResponse.json(student);
}

export async function PUT(request, { params }) {
  await dbConnect();
  const { id } = await params;
  const body = await request.json();
  const student = await Student.findByIdAndUpdate(id, body, { new: true, runValidators: true })
    .populate("courseId", "title");
  if (!student) return NextResponse.json({ error: "Student not found" }, { status: 404 });
  return NextResponse.json(student);
}

export async function DELETE(_req, { params }) {
  await dbConnect();
  const { id } = await params;
  const student = await Student.findByIdAndDelete(id);
  if (!student) return NextResponse.json({ error: "Student not found" }, { status: 404 });
  return NextResponse.json({ success: true });
}
