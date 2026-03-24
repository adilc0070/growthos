import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import FollowUp from "@/models/FollowUp";

export async function GET(request) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const leadId = searchParams.get("leadId");

  const filter = {};
  if (status && status !== "all") filter.status = status;
  if (leadId) filter.leadId = leadId;

  const followUps = await FollowUp.find(filter)
    .sort({ scheduledDate: 1 })
    .lean();
  return NextResponse.json(followUps);
}

export async function POST(request) {
  await dbConnect();
  const body = await request.json();
  const followUp = await FollowUp.create(body);
  return NextResponse.json(followUp, { status: 201 });
}
