import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import FollowUp from "@/models/FollowUp";
import Lead from "@/models/Lead";
import { FOLLOW_UP_DAYS } from "@/lib/sales-data";

export async function POST(request) {
  await dbConnect();
  const { leadId } = await request.json();

  const lead = await Lead.findById(leadId).lean();
  if (!lead) return NextResponse.json({ error: "Lead not found" }, { status: 404 });

  const existing = await FollowUp.find({ leadId, status: "pending" });
  if (existing.length > 0) {
    return NextResponse.json(
      { error: "Lead already has pending follow-ups. Complete or skip them first." },
      { status: 400 }
    );
  }

  const now = new Date();
  const sequence = FOLLOW_UP_DAYS.map((day) => ({
    leadId: lead._id,
    leadName: lead.name,
    leadPhone: lead.phone,
    sequenceDay: day,
    scheduledDate: new Date(now.getTime() + day * 24 * 60 * 60 * 1000),
    status: "pending",
    method: "whatsapp",
  }));

  const created = await FollowUp.insertMany(sequence);

  lead.timeline?.push // not a lean doc, need to update via model
  await Lead.findByIdAndUpdate(leadId, {
    $push: {
      timeline: {
        type: "sequence_started",
        description: `Auto follow-up sequence started (Day ${FOLLOW_UP_DAYS.join(", ")})`,
        createdAt: now,
      },
    },
    followUpDate: sequence[0].scheduledDate,
  });

  return NextResponse.json({ created: created.length, followUps: created }, { status: 201 });
}
