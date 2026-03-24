import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import ContentTemplate from "@/models/ContentTemplate";

export async function GET(request) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const platform = searchParams.get("platform");

  const filter = {};
  if (category && category !== "all") filter.category = category;
  if (platform && platform !== "all") filter.platform = platform;

  const templates = await ContentTemplate.find(filter)
    .sort({ createdAt: -1 })
    .lean();
  return NextResponse.json(templates);
}

export async function POST(request) {
  await dbConnect();
  const body = await request.json();

  if (!body.title || !body.category || !body.template) {
    return NextResponse.json(
      { error: "title, category, and template are required" },
      { status: 400 }
    );
  }

  const tpl = await ContentTemplate.create(body);
  return NextResponse.json(tpl, { status: 201 });
}
