import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import StudentTask from "@/models/StudentTask";
import Student from "@/models/Student";

export async function GET(request, { params }) {
  await dbConnect();
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const week = searchParams.get("week");

  const filter = { studentId: id };
  if (status && status !== "all") filter.status = status;
  if (week) filter.week = Number(week);

  const tasks = await StudentTask.find(filter).sort({ week: 1, createdAt: 1 }).lean();
  return NextResponse.json(tasks);
}

export async function POST(request, { params }) {
  await dbConnect();
  const { id } = await params;
  const body = await request.json();

  const student = await Student.findById(id);
  if (!student) return NextResponse.json({ error: "Student not found" }, { status: 404 });

  const task = await StudentTask.create({
    ...body,
    studentId: id,
    courseId: student.courseId,
  });

  return NextResponse.json(task, { status: 201 });
}
