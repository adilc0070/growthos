import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import ObjectionTemplate from "@/models/ObjectionTemplate";

export async function GET(_request, { params }) {
  await dbConnect();
  const { id } = await params;
  const obj = await ObjectionTemplate.findById(id).lean();
  if (!obj) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(obj);
}

export async function PUT(request, { params }) {
  await dbConnect();
  const { id } = await params;
  const body = await request.json();

  const obj = await ObjectionTemplate.findByIdAndUpdate(id, body, { new: true, runValidators: true });
  if (!obj) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(obj);
}

export async function DELETE(_request, { params }) {
  await dbConnect();
  const { id } = await params;
  const obj = await ObjectionTemplate.findByIdAndDelete(id);
  if (!obj) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true });
}
