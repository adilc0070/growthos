import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Lead from "@/models/Lead";
import { computeAndApplyScore } from "@/lib/lead-scoring";

export async function GET(request) {
  await dbConnect();

  const { searchParams } = new URL(request.url);
  const source = searchParams.get("source");
  const courseInterest = searchParams.get("courseInterest");
  const search = searchParams.get("search");
  const temperature = searchParams.get("temperature");
  const persona = searchParams.get("persona");
  const minScore = searchParams.get("minScore");
  const maxScore = searchParams.get("maxScore");
  const adSource = searchParams.get("adSource");

  const filter = {};
  if (source && source !== "all") filter.source = source;
  if (courseInterest && courseInterest !== "all")
    filter.courseInterest = courseInterest;
  if (temperature && temperature !== "all") filter.temperature = temperature;
  if (persona && persona !== "all") filter.persona = persona;
  if (adSource && adSource !== "all") filter.adSource = adSource;
  if (minScore || maxScore) {
    filter.leadScore = {};
    if (minScore) filter.leadScore.$gte = Number(minScore);
    if (maxScore) filter.leadScore.$lte = Number(maxScore);
  }
  if (search) {
    const regex = new RegExp(search, "i");
    filter.$or = [
      { name: regex },
      { phone: regex },
      { email: regex },
      { tags: regex },
    ];
  }

  const leads = await Lead.find(filter).sort({ createdAt: -1 }).lean();
  return NextResponse.json(leads);
}

export async function POST(request) {
  await dbConnect();

  const body = await request.json();
  const now = new Date();

  const leadData = {
    ...body,
    timeline: [
      {
        type: "created",
        description: "Lead created manually",
        createdAt: now,
      },
    ],
  };

  computeAndApplyScore(leadData);

  const lead = await Lead.create(leadData);
  return NextResponse.json(lead, { status: 201 });
}
