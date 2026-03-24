import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Student from "@/models/Student";
import StudentTask from "@/models/StudentTask";

export async function GET() {
  await dbConnect();

  const students = await Student.find({ status: "active" })
    .populate("courseId", "title")
    .lean();

  const leaderboard = await Promise.all(
    students.map(async (s) => {
      const tasks = await StudentTask.find({ studentId: s._id }).lean();
      const completed = tasks.filter((t) => t.status === "completed").length;
      const points = tasks
        .filter((t) => t.status === "completed")
        .reduce((sum, t) => sum + (t.points || 10), 0);

      return {
        _id: s._id,
        name: s.name,
        course: s.courseId?.title || "—",
        progress: s.progress,
        earnings: s.earnings,
        tasksCompleted: completed,
        totalTasks: tasks.length,
        points,
        checkIns: s.checkIns?.length || 0,
      };
    })
  );

  leaderboard.sort((a, b) => b.points - a.points || b.progress - a.progress);

  return NextResponse.json(leaderboard);
}
