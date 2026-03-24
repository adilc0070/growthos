import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import ContentTemplate from "@/models/ContentTemplate";

const SEED = [
  {
    title: "Earnings Celebration Post",
    category: "social_post",
    platform: "instagram",
    template: `🔥 Student Success Alert!\n\n{{studentName}} just earned ₹{{amount}} {{timeframe}}!\n\nFrom {{before}} to {{after}} — this is what real transformation looks like.\n\n💬 "{{quote}}"\n\nReady to write your own success story?\n👉 Link in bio\n\n#StudentSuccess #Earnings #Transformation`,
    variables: ["studentName", "amount", "timeframe", "before", "after", "quote"],
    isDefault: true,
  },
  {
    title: "Project Showcase Post",
    category: "social_post",
    platform: "linkedin",
    template: `Proud moment! 🎉\n\n{{studentName}}, one of our students, just completed an incredible project:\n\n📌 {{projectName}}\n🛠️ Built with: {{techStack}}\n⏱️ Completed in: {{duration}}\n\nWhat makes this special?\n{{highlight}}\n\nThis is proof that with the right guidance, anyone can build production-ready projects.\n\n#BuildInPublic #StudentSuccess #{{hashtag}}`,
    variables: ["studentName", "projectName", "techStack", "duration", "highlight", "hashtag"],
    isDefault: true,
  },
  {
    title: "Quick Story Caption",
    category: "caption",
    platform: "instagram",
    template: `"{{quote}}"\n\n— {{studentName}}, who went from {{before}} to {{after}} in just {{timeframe}} ✨\n\nSwipe to see their journey →`,
    variables: ["quote", "studentName", "before", "after", "timeframe"],
    isDefault: true,
  },
  {
    title: "WhatsApp Broadcast — Result Share",
    category: "whatsapp_broadcast",
    platform: "whatsapp",
    template: `🎯 *Result Update*\n\n*{{studentName}}* just {{achievement}}!\n\n_"{{quote}}"_\n\nWant similar results? Reply "INFO" to know more about our program.`,
    variables: ["studentName", "achievement", "quote"],
    isDefault: true,
  },
  {
    title: "Reel Script — Transformation",
    category: "reel_script",
    platform: "instagram",
    template: `[HOOK — 0-3s]\n"{{hookLine}}"\n\n[BEFORE — 3-8s]\nShow: {{beforeContext}}\nText overlay: "{{beforeText}}"\n\n[AFTER — 8-15s]\nShow: {{afterContext}}\nText overlay: "{{afterText}}"\n\n[CTA — 15-20s]\n"{{ctaLine}}"\nPoint to link in bio`,
    variables: ["hookLine", "beforeContext", "beforeText", "afterContext", "afterText", "ctaLine"],
    isDefault: true,
  },
  {
    title: "Story Poll — Social Proof",
    category: "story",
    platform: "instagram",
    template: `{{studentName}} earned ₹{{amount}} in {{timeframe}}.\n\nDo you think YOU can do the same?\n\n🟢 Yes, I'm ready!\n🔴 Not sure yet\n\n[Add poll sticker]`,
    variables: ["studentName", "amount", "timeframe"],
    isDefault: true,
  },
];

export async function POST() {
  await dbConnect();
  const existing = await ContentTemplate.countDocuments();
  if (existing > 0) {
    return NextResponse.json({
      seeded: false,
      message: "Templates already exist. Delete them first to re-seed.",
    });
  }
  await ContentTemplate.insertMany(SEED);
  return NextResponse.json({ seeded: true, count: SEED.length });
}
