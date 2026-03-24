import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Lead from "@/models/Lead";

export async function GET(request) {
  await dbConnect();

  const { searchParams } = new URL(request.url);
  const source = searchParams.get("source");
  const courseInterest = searchParams.get("courseInterest");
  const search = searchParams.get("search");

  const filter = {};
  if (source && source !== "all") filter.source = source;
  if (courseInterest && courseInterest !== "all")
    filter.courseInterest = courseInterest;
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

  const lead = await Lead.create({
    ...body,
    timeline: [
      {
        type: "created",
        description: "Lead created manually",
        createdAt: now,
      },
    ],
  });

  return NextResponse.json(lead, { status: 201 });
}
