import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Course from "@/models/Course";

export async function GET() {
  await dbConnect();
  const courses = await Course.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json(courses);
}

export async function POST(request) {
  await dbConnect();
  const body = await request.json();
  const course = await Course.create(body);
  return NextResponse.json(course, { status: 201 });
}
