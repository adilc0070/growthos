import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Student from "@/models/Student";
import Course from "@/models/Course";
import StudentTask from "@/models/StudentTask";

function randomPick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const NAMES = [
  "Rahul Sharma", "Priya Patel", "Arjun Singh", "Sneha Gupta",
  "Vikram Mehta", "Ananya Reddy", "Rohit Kumar", "Neha Joshi",
  "Aditya Verma", "Kavya Nair",
];

const TASK_TEMPLATES = [
  { title: "Set up development environment", type: "task", week: 1, points: 10 },
  { title: "Build a landing page", type: "task", week: 1, points: 15 },
  { title: "Complete module quiz", type: "challenge", week: 2, points: 20 },
  { title: "Build a mini-project", type: "assignment", week: 2, points: 30 },
  { title: "Code review challenge", type: "challenge", week: 3, points: 20 },
  { title: "Submit portfolio project", type: "assignment", week: 3, points: 40 },
  { title: "Peer feedback exercise", type: "task", week: 4, points: 10 },
  { title: "Final project submission", type: "assignment", week: 4, points: 50 },
];

export async function POST() {
  await dbConnect();

  const existing = await Student.countDocuments();
  if (existing > 0) {
    return NextResponse.json({ seeded: false, message: "Students already exist." });
  }

  let courses = await Course.find().lean();
  if (courses.length === 0) {
    return NextResponse.json({ seeded: false, message: "Seed courses first." });
  }

  const students = [];
  for (const name of NAMES) {
    const course = randomPick(courses);
    const progress = Math.floor(Math.random() * 80);
    const earnings = Math.random() > 0.6 ? Math.floor(Math.random() * 15000) : 0;

    students.push({
      name,
      email: `${name.toLowerCase().replace(/\s/g, ".")}@example.com`,
      phone: `91${String(Math.floor(Math.random() * 9000000000) + 1000000000)}`,
      courseId: course._id,
      status: randomPick(["active", "active", "active", "paused", "completed"]),
      progress,
      earnings,
      firstEarningDate: earnings > 0 ? new Date(Date.now() - Math.random() * 30 * 86400000) : null,
      skills: (course.skills || []).slice(0, 3).map((s) => ({
        name: s,
        level: Math.floor(Math.random() * 70) + 10,
      })),
      communityLinks: { whatsapp: "", discord: "" },
      timeline: [{ type: "enrolled", description: `Enrolled in ${course.title}` }],
    });
  }

  const created = await Student.insertMany(students);

  const taskDocs = [];
  for (const student of created) {
    const count = Math.floor(Math.random() * 5) + 3;
    const picked = TASK_TEMPLATES.slice(0, count);
    for (const tpl of picked) {
      const statuses = ["pending", "in_progress", "completed", "completed"];
      taskDocs.push({
        studentId: student._id,
        courseId: student.courseId,
        title: tpl.title,
        week: tpl.week,
        type: tpl.type,
        points: tpl.points,
        status: randomPick(statuses),
        dueDate: new Date(Date.now() + tpl.week * 7 * 86400000),
      });
    }
  }

  await StudentTask.insertMany(taskDocs);

  return NextResponse.json({ seeded: true, students: created.length, tasks: taskDocs.length });
}
