import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import ObjectionTemplate from "@/models/ObjectionTemplate";

export async function GET(request) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");

  const filter = {};
  if (category && category !== "all") filter.category = category;

  const objections = await ObjectionTemplate.find(filter).sort({ createdAt: -1 }).lean();
  return NextResponse.json(objections);
}

export async function POST(request) {
  await dbConnect();
  const body = await request.json();
  const objection = await ObjectionTemplate.create(body);
  return NextResponse.json(objection, { status: 201 });
}
