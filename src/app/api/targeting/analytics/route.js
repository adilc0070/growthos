import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Lead from "@/models/Lead";

export async function GET() {
  await dbConnect();

  const [
    temperatureCounts,
    personaCounts,
    adSourceStats,
    scoreDistribution,
    totalLeads,
  ] = await Promise.all([
    Lead.aggregate([
      { $group: { _id: "$temperature", count: { $sum: 1 } } },
    ]),
    Lead.aggregate([
      { $match: { persona: { $ne: "" } } },
      { $group: { _id: "$persona", count: { $sum: 1 } } },
    ]),
    Lead.aggregate([
      { $match: { adSource: { $ne: "" } } },
      {
        $group: {
          _id: "$adSource",
          total: { $sum: 1 },
          converted: {
            $sum: { $cond: [{ $eq: ["$status", "converted"] }, 1, 0] },
          },
          avgScore: { $avg: "$leadScore" },
          hotLeads: {
            $sum: { $cond: [{ $eq: ["$temperature", "hot"] }, 1, 0] },
          },
        },
      },
      { $sort: { total: -1 } },
    ]),
    Lead.aggregate([
      {
        $bucket: {
          groupBy: "$leadScore",
          boundaries: [0, 20, 40, 60, 80, 101],
          default: "other",
          output: { count: { $sum: 1 } },
        },
      },
    ]),
    Lead.countDocuments(),
  ]);

  const temperature = {};
  for (const t of temperatureCounts) {
    temperature[t._id || "cold"] = t.count;
  }

  const personas = {};
  for (const p of personaCounts) {
    personas[p._id] = p.count;
  }

  const adSources = adSourceStats.map((s) => ({
    adSource: s._id,
    total: s.total,
    converted: s.converted,
    conversionRate: s.total > 0 ? Math.round((s.converted / s.total) * 100) : 0,
    avgScore: Math.round(s.avgScore || 0),
    hotLeads: s.hotLeads,
  }));

  const scores = {
    "0-19": 0,
    "20-39": 0,
    "40-59": 0,
    "60-79": 0,
    "80-100": 0,
  };
  const bucketLabels = ["0-19", "20-39", "40-59", "60-79", "80-100"];
  for (const b of scoreDistribution) {
    if (b._id === "other") continue;
    const idx = [0, 20, 40, 60, 80].indexOf(b._id);
    if (idx >= 0) scores[bucketLabels[idx]] = b.count;
  }

  return NextResponse.json({
    totalLeads,
    temperature,
    personas,
    adSources,
    scoreDistribution: scores,
  });
}
