import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import ContentTemplate from "@/models/ContentTemplate";
import Testimonial from "@/models/Testimonial";

export async function POST(request) {
  await dbConnect();
  const { testimonialId, templateId, variables } = await request.json();

  if (!templateId) {
    return NextResponse.json(
      { error: "templateId is required" },
      { status: 400 }
    );
  }

  const template = await ContentTemplate.findById(templateId).lean();
  if (!template) {
    return NextResponse.json(
      { error: "Template not found" },
      { status: 404 }
    );
  }

  let vars = { ...variables };

  if (testimonialId) {
    const testimonial = await Testimonial.findById(testimonialId).lean();
    if (testimonial) {
      vars = {
        studentName: testimonial.studentName,
        quote: testimonial.content,
        amount: testimonial.resultAmount?.toLocaleString("en-IN") || "0",
        achievement: testimonial.resultDescription,
        ...vars,
      };
    }
  }

  let output = template.template;
  for (const [key, value] of Object.entries(vars)) {
    output = output.replace(new RegExp(`\\{\\{${key}\\}\\}`, "g"), value || "");
  }

  return NextResponse.json({
    generated: output,
    template: template.title,
    platform: template.platform,
    remainingVars: (output.match(/\{\{(\w+)\}\}/g) || []).map((v) =>
      v.replace(/[{}]/g, "")
    ),
  });
}
