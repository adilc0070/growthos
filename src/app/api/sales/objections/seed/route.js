import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import ObjectionTemplate from "@/models/ObjectionTemplate";
import { SEED_OBJECTIONS } from "@/lib/sales-data";

export async function POST() {
  await dbConnect();
  const count = await ObjectionTemplate.countDocuments();
  if (count > 0) {
    return NextResponse.json({ seeded: false, message: "Objection templates already exist" });
  }
  await ObjectionTemplate.insertMany(SEED_OBJECTIONS);
  return NextResponse.json({ seeded: true, count: SEED_OBJECTIONS.length });
}
