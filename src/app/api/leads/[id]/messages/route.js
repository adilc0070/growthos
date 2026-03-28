import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import ChatMessage from "@/models/ChatMessage";
import { requireRole } from "@/lib/auth";

export async function GET(_request, { params }) {
  const { session, error } = await requireRole("admin", "sales");
  if (error) return error;
  await dbConnect();

  const { id } = await params;

  const messages = await ChatMessage.find({ leadId: id })
    .sort({ timestamp: 1 })
    .lean();

  return NextResponse.json(messages);
}
