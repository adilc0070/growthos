import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Student from "@/models/Student";
import StudentTask from "@/models/StudentTask";
import Course from "@/models/Course";

export async function GET() {
  await dbConnect();

  const [students, tasks, courses] = await Promise.all([
    Student.find().lean(),
    StudentTask.find().lean(),
    Course.find().lean(),
  ]);

  const active = students.filter((s) => s.status === "active").length;
  const completed = students.filter((s) => s.status === "completed").length;
  const dropped = students.filter((s) => s.status === "dropped").length;

  const avgProgress =
    students.length > 0
      ? Math.round(students.reduce((s, st) => s + st.progress, 0) / students.length)
      : 0;

  const totalEarnings = students.reduce((s, st) => s + (st.earnings || 0), 0);
  const earners = students.filter((s) => s.earnings > 0).length;

  const completedTasks = tasks.filter((t) => t.status === "completed").length;
  const submittedTasks = tasks.filter((t) => t.status === "submitted").length;

  const enrollmentByCourse = courses.map((c) => ({
    course: c.title,
    count: students.filter((s) => String(s.courseId) === String(c._id)).length,
  }));

  return NextResponse.json({
    totalStudents: students.length,
    active,
    completed,
    dropped,
    avgProgress,
    totalEarnings,
    earners,
    totalTasks: tasks.length,
    completedTasks,
    submittedTasks,
    totalCourses: courses.length,
    enrollmentByCourse,
  });
}
