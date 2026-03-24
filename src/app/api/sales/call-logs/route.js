import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import CallLog from "@/models/CallLog";
import Lead from "@/models/Lead";

export async function GET(request) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const leadId = searchParams.get("leadId");

  const filter = {};
  if (leadId) filter.leadId = leadId;

  const logs = await CallLog.find(filter).sort({ createdAt: -1 }).lean();
  return NextResponse.json(logs);
}

export async function POST(request) {
  await dbConnect();
  const body = await request.json();
  const log = await CallLog.create(body);

  const typeLabel =
    body.type === "voicenote" ? "Voice note" :
    body.type === "whatsapp" ? "WhatsApp message" : "Call";

  await Lead.findByIdAndUpdate(body.leadId, {
    $push: {
      timeline: {
        type: "call_logged",
        description: `${typeLabel} logged — ${body.outcome} (${body.direction})`,
        createdAt: new Date(),
      },
    },
  });

  return NextResponse.json(log, { status: 201 });
}
