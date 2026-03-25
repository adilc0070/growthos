import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { requireRole } from "@/lib/auth";

export async function PUT(request, { params }) {
  const { session, error } = await requireRole("admin");
  if (error) return error;

  await dbConnect();
  const { id } = await params;
  const body = await request.json();

  const user = await User.findById(id);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (body.name !== undefined) user.name = body.name.trim();
  if (body.role !== undefined) {
    if (!["admin", "sales", "student"].includes(body.role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }
    user.role = body.role;
  }
  if (body.isActive !== undefined) user.isActive = body.isActive;
  if (body.password && body.password.length >= 6) {
    user.password = await bcrypt.hash(body.password, 12);
  }

  await user.save();

  return NextResponse.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt,
  });
}

export async function DELETE(request, { params }) {
  const { session, error } = await requireRole("admin");
  if (error) return error;

  await dbConnect();
  const { id } = await params;

  if (id === session.user.id) {
    return NextResponse.json(
      { error: "Cannot delete your own account" },
      { status: 400 }
    );
  }

  const user = await User.findByIdAndDelete(id);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
