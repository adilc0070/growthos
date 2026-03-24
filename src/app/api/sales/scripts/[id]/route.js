import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import SalesScript from "@/models/SalesScript";

export async function GET(_request, { params }) {
  await dbConnect();
  const { id } = await params;
  const script = await SalesScript.findById(id).lean();
  if (!script) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(script);
}

export async function PUT(request, { params }) {
  await dbConnect();
  const { id } = await params;
  const body = await request.json();

  const script = await SalesScript.findByIdAndUpdate(id, body, { new: true, runValidators: true });
  if (!script) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(script);
}

export async function DELETE(_request, { params }) {
  await dbConnect();
  const { id } = await params;
  const script = await SalesScript.findByIdAndDelete(id);
  if (!script) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true });
}
