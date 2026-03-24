import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Lead from "@/models/Lead";

export async function POST(request, { params }) {
  await dbConnect();
  const { id } = await params;
  const { message, scriptTitle } = await request.json();

  const lead = await Lead.findById(id);
  if (!lead) return NextResponse.json({ error: "Not found" }, { status: 404 });

  lead.timeline.push({
    type: "whatsapp_sent",
    description: `WhatsApp message sent${scriptTitle ? ` using "${scriptTitle}"` : ""}`,
    createdAt: new Date(),
  });

  await lead.save();
  return NextResponse.json({ success: true, lead });
}
