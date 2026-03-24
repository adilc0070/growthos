import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import SalesScript from "@/models/SalesScript";

export async function GET(request) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");

  const filter = {};
  if (category && category !== "all") filter.category = category;

  const scripts = await SalesScript.find(filter).sort({ createdAt: -1 }).lean();
  return NextResponse.json(scripts);
}

export async function POST(request) {
  await dbConnect();
  const body = await request.json();
  const script = await SalesScript.create(body);
  return NextResponse.json(script, { status: 201 });
}
