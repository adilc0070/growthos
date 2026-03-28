import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { requireRole } from "@/lib/auth";

export async function GET() {
  const { error } = await requireRole("admin", "sales");
  if (error) return error;

  await dbConnect();
  const users = await User.find({
    isActive: true,
    role: { $in: ["admin", "sales"] },
  })
    .select("name email role")
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json(users);
}

