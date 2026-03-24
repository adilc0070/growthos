import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Student from "@/models/Student";

export async function POST(request, { params }) {
  await dbConnect();
  const { id } = await params;
  const body = await request.json();

  const student = await Student.findById(id);
  if (!student) return NextResponse.json({ error: "Student not found" }, { status: 404 });

  student.checkIns.push({
    notes: body.notes || "",
    mood: body.mood || "good",
  });

  student.timeline.push({
    type: "checkin",
    description: `Weekly check-in — feeling ${body.mood || "good"}`,
  });

  await student.save();
  return NextResponse.json(student.checkIns[student.checkIns.length - 1], { status: 201 });
}
