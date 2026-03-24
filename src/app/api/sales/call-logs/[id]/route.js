import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import CallLog from "@/models/CallLog";

export async function DELETE(_request, { params }) {
  await dbConnect();
  const { id } = await params;
  const log = await CallLog.findByIdAndDelete(id);
  if (!log) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true });
}
