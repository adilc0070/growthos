import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Lead from "@/models/Lead";
import { MOCK_LEADS } from "@/lib/leads-data";

export async function POST() {
  await dbConnect();

  const count = await Lead.countDocuments();
  if (count > 0) {
    return NextResponse.json(
      { message: `Database already has ${count} leads. Delete them first or skip seeding.`, seeded: false },
      { status: 200 }
    );
  }

  const docs = MOCK_LEADS.map((l) => ({
    name: l.name,
    phone: l.phone,
    email: l.email || "",
    source: l.source,
    adSource: l.adSource || "",
    status: l.status,
    budget: l.budget || "",
    courseInterest: l.courseInterest || "",
    tags: l.tags || [],
    persona: l.persona || "",
    urgency: l.urgency || "low",
    engagement: l.engagement || "none",
    leadScore: l.leadScore || 0,
    temperature: l.temperature || "cold",
    qualificationData: l.qualificationData
      ? {
          ...l.qualificationData,
          qualifiedAt: l.qualificationData.qualifiedAt
            ? new Date(l.qualificationData.qualifiedAt)
            : null,
        }
      : undefined,
    notes: (l.notes || []).map((n) => ({
      text: n.text,
      createdAt: new Date(n.createdAt),
    })),
    timeline: (l.timeline || []).map((t) => ({
      type: t.type,
      description: t.description,
      createdAt: new Date(t.createdAt),
    })),
    followUpDate: l.followUpDate ? new Date(l.followUpDate) : null,
    createdAt: new Date(l.createdAt),
  }));

  const inserted = await Lead.insertMany(docs);
  return NextResponse.json(
    { message: `Seeded ${inserted.length} leads`, seeded: true },
    { status: 201 }
  );
}
