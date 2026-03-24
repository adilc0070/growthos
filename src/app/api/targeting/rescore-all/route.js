import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Lead from "@/models/Lead";
import { computeAndApplyScore } from "@/lib/lead-scoring";

export async function POST() {
  await dbConnect();

  const leads = await Lead.find();
  let updated = 0;

  for (const lead of leads) {
    computeAndApplyScore(lead);
    await lead.save();
    updated++;
  }

  return NextResponse.json({ message: `Rescored ${updated} leads`, updated });
}
