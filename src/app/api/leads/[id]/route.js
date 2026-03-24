import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Lead from "@/models/Lead";

export async function GET(_request, { params }) {
  await dbConnect();
  const { id } = await params;
  const lead = await Lead.findById(id).lean();
  if (!lead) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(lead);
}

export async function PUT(request, { params }) {
  await dbConnect();
  const { id } = await params;
  const body = await request.json();

  const lead = await Lead.findById(id);
  if (!lead) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const updatableFields = [
    "name",
    "phone",
    "email",
    "source",
    "status",
    "budget",
    "courseInterest",
    "tags",
    "followUpDate",
  ];
  for (const key of updatableFields) {
    if (body[key] !== undefined) lead[key] = body[key];
  }

  lead.timeline.push({
    type: "edited",
    description: "Lead details updated",
    createdAt: new Date(),
  });

  await lead.save();
  return NextResponse.json(lead);
}

export async function DELETE(_request, { params }) {
  await dbConnect();
  const { id } = await params;
  const lead = await Lead.findByIdAndDelete(id);
  if (!lead) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true });
}
