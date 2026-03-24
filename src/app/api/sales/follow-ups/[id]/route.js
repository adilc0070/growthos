import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import FollowUp from "@/models/FollowUp";
import Lead from "@/models/Lead";

export async function GET(_request, { params }) {
  await dbConnect();
  const { id } = await params;
  const followUp = await FollowUp.findById(id).lean();
  if (!followUp) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(followUp);
}

export async function PUT(request, { params }) {
  await dbConnect();
  const { id } = await params;
  const body = await request.json();

  const followUp = await FollowUp.findByIdAndUpdate(id, body, { new: true, runValidators: true });
  if (!followUp) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(followUp);
}

export async function PATCH(request, { params }) {
  await dbConnect();
  const { id } = await params;
  const { status, notes } = await request.json();

  const followUp = await FollowUp.findById(id);
  if (!followUp) return NextResponse.json({ error: "Not found" }, { status: 404 });

  followUp.status = status;
  if (notes) followUp.notes = notes;
  if (status === "completed") followUp.completedAt = new Date();
  await followUp.save();

  await Lead.findByIdAndUpdate(followUp.leadId, {
    $push: {
      timeline: {
        type: "follow_up",
        description: `Follow-up ${status === "completed" ? "completed" : "skipped"} (Day ${followUp.sequenceDay || "manual"})`,
        createdAt: new Date(),
      },
    },
  });

  return NextResponse.json(followUp);
}

export async function DELETE(_request, { params }) {
  await dbConnect();
  const { id } = await params;
  const followUp = await FollowUp.findByIdAndDelete(id);
  if (!followUp) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true });
}
