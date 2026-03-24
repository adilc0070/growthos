import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Student from "@/models/Student";

export async function GET(request) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const courseId = searchParams.get("courseId");

  const filter = {};
  if (status && status !== "all") filter.status = status;
  if (courseId && courseId !== "all") filter.courseId = courseId;

  const students = await Student.find(filter)
    .populate("courseId", "title")
    .sort({ createdAt: -1 })
    .lean();
  return NextResponse.json(students);
}

export async function POST(request) {
  await dbConnect();
  const body = await request.json();

  const student = await Student.create({
    ...body,
    timeline: [
      {
        type: "enrolled",
        description: `Enrolled in course`,
        createdAt: new Date(),
      },
    ],
  });

  const populated = await Student.findById(student._id)
    .populate("courseId", "title")
    .lean();
  return NextResponse.json(populated, { status: 201 });
}
