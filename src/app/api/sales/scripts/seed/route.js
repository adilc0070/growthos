import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import SalesScript from "@/models/SalesScript";
import { SEED_SCRIPTS } from "@/lib/sales-data";

export async function POST() {
  await dbConnect();
  const count = await SalesScript.countDocuments();
  if (count > 0) {
    return NextResponse.json({ seeded: false, message: "Scripts already exist" });
  }
  await SalesScript.insertMany(SEED_SCRIPTS);
  return NextResponse.json({ seeded: true, count: SEED_SCRIPTS.length });
}
