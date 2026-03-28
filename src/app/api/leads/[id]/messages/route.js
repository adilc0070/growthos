import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import ChatMessage from "@/models/ChatMessage";
import { requireAutomationOrSession } from "@/lib/automation-auth";

export async function GET(request, { params }) {
  const auth = await requireAutomationOrSession(request);
  if (!auth.ok) return auth.error;
  await dbConnect();

  const { id } = await params;

  const messages = await ChatMessage.find({ leadId: id })
    .sort({ timestamp: 1 })
    .lean();

  return NextResponse.json(messages);
}
