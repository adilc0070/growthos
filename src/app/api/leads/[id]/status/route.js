import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Lead from "@/models/Lead";

const STATUS_LABELS = {
  new: "New",
  contacted: "Contacted",
  interested: "Interested",
  payment_pending: "Payment Pending",
  converted: "Converted",
  dropped: "Dropped",
};

export async function PATCH(request, { params }) {
  await dbConnect();
  const { id } = await params;
  const { status } = await request.json();

  if (!STATUS_LABELS[status]) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const lead = await Lead.findById(id);
  if (!lead) return NextResponse.json({ error: "Not found" }, { status: 404 });

  lead.status = status;
  lead.timeline.push({
    type: "status_change",
    description: `Status changed to ${STATUS_LABELS[status]}`,
    createdAt: new Date(),
  });

  await lead.save();
  return NextResponse.json(lead);
}
