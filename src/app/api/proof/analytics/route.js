import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Testimonial from "@/models/Testimonial";
import CaseStudy from "@/models/CaseStudy";

export async function GET() {
  await dbConnect();

  const [testimonials, caseStudies] = await Promise.all([
    Testimonial.find().lean(),
    CaseStudy.find().lean(),
  ]);

  const total = testimonials.length;
  const pending = testimonials.filter((t) => t.status === "pending").length;
  const approved = testimonials.filter((t) => t.status === "approved").length;
  const published = testimonials.filter((t) => t.status === "published").length;

  const byType = {
    video: testimonials.filter((t) => t.type === "video").length,
    text: testimonials.filter((t) => t.type === "text").length,
    screenshot: testimonials.filter((t) => t.type === "screenshot").length,
  };

  const totalViews = testimonials.reduce((s, t) => s + (t.views || 0), 0);
  const totalClicks = testimonials.reduce((s, t) => s + (t.clicks || 0), 0);
  const totalConversions = testimonials.reduce((s, t) => s + (t.conversions || 0), 0);

  const avgConversionRate =
    totalViews > 0 ? ((totalConversions / totalViews) * 100).toFixed(1) : "0";
  const avgClickRate =
    totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : "0";

  const topPerformers = [...testimonials]
    .sort((a, b) => (b.conversions || 0) - (a.conversions || 0))
    .slice(0, 5)
    .map((t) => ({
      id: t._id,
      studentName: t.studentName,
      type: t.type,
      views: t.views,
      clicks: t.clicks,
      conversions: t.conversions,
      conversionRate:
        t.views > 0 ? ((t.conversions / t.views) * 100).toFixed(1) : "0",
    }));

  const byTag = {};
  for (const t of testimonials) {
    for (const tag of t.tags || []) {
      if (!byTag[tag]) byTag[tag] = { count: 0, views: 0, conversions: 0 };
      byTag[tag].count++;
      byTag[tag].views += t.views || 0;
      byTag[tag].conversions += t.conversions || 0;
    }
  }

  const tagPerformance = Object.entries(byTag).map(([tag, data]) => ({
    tag,
    ...data,
    conversionRate:
      data.views > 0 ? ((data.conversions / data.views) * 100).toFixed(1) : "0",
  }));

  const totalResultAmount = testimonials.reduce(
    (s, t) => s + (t.resultAmount || 0),
    0
  );
  const featured = testimonials.filter((t) => t.featured).length;

  return NextResponse.json({
    total,
    pending,
    approved,
    published,
    byType,
    totalViews,
    totalClicks,
    totalConversions,
    avgConversionRate,
    avgClickRate,
    topPerformers,
    tagPerformance,
    totalResultAmount,
    featured,
    totalCaseStudies: caseStudies.length,
    publishedCaseStudies: caseStudies.filter((c) => c.status === "published")
      .length,
  });
}
