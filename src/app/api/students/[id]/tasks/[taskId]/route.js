import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import StudentTask from "@/models/StudentTask";
import Student from "@/models/Student";

export async function PATCH(request, { params }) {
  await dbConnect();
  const { id, taskId } = await params;
  const body = await request.json();

  const task = await StudentTask.findOneAndUpdate(
    { _id: taskId, studentId: id },
    body,
    { new: true, runValidators: true }
  );
  if (!task) return NextResponse.json({ error: "Task not found" }, { status: 404 });

  if (body.status === "completed" || body.submission) {
    const student = await Student.findById(id);
    if (student) {
      const allTasks = await StudentTask.find({ studentId: id });
      const completed = allTasks.filter((t) => t.status === "completed").length;
      student.progress = allTasks.length > 0 ? Math.round((completed / allTasks.length) * 100) : 0;

      const timelineEntry = body.submission
        ? { type: "assignment_submitted", description: `Submitted: ${task.title}` }
        : { type: "task_completed", description: `Completed: ${task.title}` };
      student.timeline.push(timelineEntry);

      await student.save();
    }
  }

  return NextResponse.json(task);
}

export async function DELETE(_req, { params }) {
  await dbConnect();
  const { id, taskId } = await params;
  const task = await StudentTask.findOneAndDelete({ _id: taskId, studentId: id });
  if (!task) return NextResponse.json({ error: "Task not found" }, { status: 404 });
  return NextResponse.json({ success: true });
}
