import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Student from "@/models/Student";

export async function PUT(request, { params }) {
  await dbConnect();
  const { id } = await params;
  const { skills } = await request.json();

  const student = await Student.findById(id);
  if (!student) return NextResponse.json({ error: "Student not found" }, { status: 404 });

  student.skills = skills;
  student.timeline.push({
    type: "skill_updated",
    description: `Skills updated`,
  });

  await student.save();
  return NextResponse.json({ skills: student.skills });
}
