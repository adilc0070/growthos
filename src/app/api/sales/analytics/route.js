import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Lead from "@/models/Lead";
import CallLog from "@/models/CallLog";
import FollowUp from "@/models/FollowUp";

export async function GET() {
  await dbConnect();

  const [leads, callLogs, followUps] = await Promise.all([
    Lead.find({}).lean(),
    CallLog.find({}).lean(),
    FollowUp.find({}).lean(),
  ]);

  const totalLeads = leads.length;
  const converted = leads.filter((l) => l.status === "converted").length;
  const dropped = leads.filter((l) => l.status === "dropped").length;
  const conversionRate = totalLeads ? ((converted / totalLeads) * 100).toFixed(1) : 0;

  const byStatus = {};
  for (const l of leads) {
    byStatus[l.status] = (byStatus[l.status] || 0) + 1;
  }

  const bySalesperson = {};
  for (const l of leads) {
    const sp = l.assignedTo || "Unassigned";
    if (!bySalesperson[sp]) {
      bySalesperson[sp] = { total: 0, converted: 0, dropped: 0, calls: 0, whatsapp: 0 };
    }
    bySalesperson[sp].total++;
    if (l.status === "converted") bySalesperson[sp].converted++;
    if (l.status === "dropped") bySalesperson[sp].dropped++;
  }

  for (const cl of callLogs) {
    const sp = cl.salesperson || "Unassigned";
    if (!bySalesperson[sp]) {
      bySalesperson[sp] = { total: 0, converted: 0, dropped: 0, calls: 0, whatsapp: 0 };
    }
    if (cl.type === "call" || cl.type === "voicenote") bySalesperson[sp].calls++;
    if (cl.type === "whatsapp") bySalesperson[sp].whatsapp++;
  }

  const totalCalls = callLogs.filter((c) => c.type === "call").length;
  const totalWhatsApp = callLogs.filter((c) => c.type === "whatsapp").length;
  const totalVoiceNotes = callLogs.filter((c) => c.type === "voicenote").length;
  const pendingFollowUps = followUps.filter((f) => f.status === "pending").length;
  const completedFollowUps = followUps.filter((f) => f.status === "completed").length;

  const bySource = {};
  for (const l of leads) {
    if (!bySource[l.source]) bySource[l.source] = { total: 0, converted: 0 };
    bySource[l.source].total++;
    if (l.status === "converted") bySource[l.source].converted++;
  }

  return NextResponse.json({
    overview: {
      totalLeads,
      converted,
      dropped,
      conversionRate: Number(conversionRate),
      totalCalls,
      totalWhatsApp,
      totalVoiceNotes,
      pendingFollowUps,
      completedFollowUps,
    },
    byStatus,
    bySalesperson,
    bySource,
  });
}
