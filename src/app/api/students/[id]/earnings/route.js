import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Student from "@/models/Student";

export async function PATCH(request, { params }) {
  await dbConnect();
  const { id } = await params;
  const { amount } = await request.json();

  const student = await Student.findById(id);
  if (!student) return NextResponse.json({ error: "Student not found" }, { status: 404 });

  const prev = student.earnings;
  student.earnings = (student.earnings || 0) + Number(amount);

  if (prev === 0 && Number(amount) > 0 && !student.firstEarningDate) {
    student.firstEarningDate = new Date();
  }

  student.timeline.push({
    type: "earning_logged",
    description: `Earned ₹${amount} (total: ₹${student.earnings})`,
  });

  await student.save();
  return NextResponse.json({
    earnings: student.earnings,
    firstEarningDate: student.firstEarningDate,
  });
}
