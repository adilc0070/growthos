import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(request) {
  await dbConnect();

  const adminCount = await User.countDocuments({ role: "admin" });
  if (adminCount > 0) {
    return NextResponse.json(
      { error: "Admin already exists. Use login instead." },
      { status: 403 }
    );
  }

  const { name, email, password } = await request.json();

  if (!name?.trim() || !email?.trim() || !password) {
    return NextResponse.json(
      { error: "Name, email, and password are required" },
      { status: 400 }
    );
  }

  if (password.length < 6) {
    return NextResponse.json(
      { error: "Password must be at least 6 characters" },
      { status: 400 }
    );
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    return NextResponse.json(
      { error: "Email already in use" },
      { status: 409 }
    );
  }

  const hash = await bcrypt.hash(password, 12);
  const user = await User.create({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password: hash,
    role: "admin",
    isActive: true,
  });

  return NextResponse.json(
    { id: user._id, name: user.name, email: user.email, role: user.role },
    { status: 201 }
  );
}

export async function GET() {
  await dbConnect();
  const adminCount = await User.countDocuments({ role: "admin" });
  return NextResponse.json({ adminExists: adminCount > 0 });
}
