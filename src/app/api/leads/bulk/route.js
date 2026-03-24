import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Lead from "@/models/Lead";

const VALID_SOURCES = ["Ads", "Organic", "Referral"];
const VALID_STATUSES = [
  "new",
  "contacted",
  "interested",
  "payment_pending",
  "converted",
  "dropped",
];

export async function POST(request) {
  await dbConnect();

  const { leads } = await request.json();

  if (!Array.isArray(leads) || leads.length === 0) {
    return NextResponse.json(
      { error: "Provide a non-empty leads array" },
      { status: 400 }
    );
  }

  if (leads.length > 500) {
    return NextResponse.json(
      { error: "Maximum 500 leads per upload" },
      { status: 400 }
    );
  }

  const now = new Date();
  const errors = [];
  const docs = [];

  for (let i = 0; i < leads.length; i++) {
    const row = leads[i];
    const rowNum = i + 1;

    if (!row.name?.trim()) {
      errors.push({ row: rowNum, field: "name", message: "Name is required" });
      continue;
    }
    if (!row.phone?.trim()) {
      errors.push({ row: rowNum, field: "phone", message: "Phone is required" });
      continue;
    }

    const source = row.source?.trim() || "Ads";
    if (!VALID_SOURCES.includes(source)) {
      errors.push({
        row: rowNum,
        field: "source",
        message: `Invalid source "${source}". Use: ${VALID_SOURCES.join(", ")}`,
      });
      continue;
    }

    const status = row.status?.trim() || "new";
    if (!VALID_STATUSES.includes(status)) {
      errors.push({
        row: rowNum,
        field: "status",
        message: `Invalid status "${status}". Use: ${VALID_STATUSES.join(", ")}`,
      });
      continue;
    }

    const tags = row.tags
      ? String(row.tags)
          .split(/[,;]/)
          .map((t) => t.trim())
          .filter(Boolean)
      : [];

    docs.push({
      name: row.name.trim(),
      phone: row.phone.trim(),
      email: row.email?.trim() || "",
      source,
      status,
      budget: row.budget?.trim() || "",
      courseInterest: row.courseInterest?.trim() || "",
      tags,
      notes: [],
      timeline: [
        {
          type: "created",
          description: "Lead created via bulk upload",
          createdAt: now,
        },
      ],
      followUpDate: row.followUpDate ? new Date(row.followUpDate) : null,
      createdAt: now,
    });
  }

  let inserted = [];
  if (docs.length > 0) {
    inserted = await Lead.insertMany(docs, { ordered: false });
  }

  return NextResponse.json({
    imported: inserted.length,
    errors,
    total: leads.length,
  });
}
