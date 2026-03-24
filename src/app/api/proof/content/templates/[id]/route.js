import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import ContentTemplate from "@/models/ContentTemplate";

export async function PUT(request, { params }) {
  await dbConnect();
  const { id } = await params;
  const body = await request.json();
  const tpl = await ContentTemplate.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true,
  }).lean();
  if (!tpl) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(tpl);
}

export async function DELETE(request, { params }) {
  await dbConnect();
  const { id } = await params;
  const tpl = await ContentTemplate.findByIdAndDelete(id);
  if (!tpl) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ deleted: true });
}
