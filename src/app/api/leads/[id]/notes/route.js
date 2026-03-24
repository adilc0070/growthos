import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Lead from "@/models/Lead";

export async function POST(request, { params }) {
  await dbConnect();
  const { id } = await params;
  const { text } = await request.json();

  if (!text?.trim()) {
    return NextResponse.json({ error: "Note text required" }, { status: 400 });
  }

  const lead = await Lead.findById(id);
  if (!lead) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const now = new Date();
  const preview = text.length > 60 ? text.slice(0, 60) + "…" : text;

  lead.notes.push({ text: text.trim(), createdAt: now });
  lead.timeline.push({
    type: "note",
    description: `Note added: "${preview}"`,
    createdAt: now,
  });

  await lead.save();
  return NextResponse.json(lead);
}
