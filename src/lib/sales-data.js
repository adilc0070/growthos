export const SCRIPT_CATEGORIES = [
  "Introduction",
  "Follow-up",
  "Closing",
  "Objection Handling",
  "General",
];

export const OBJECTION_CATEGORIES = [
  "Price",
  "Timing",
  "Trust",
  "Competition",
  "General",
];

export const FOLLOW_UP_DAYS = [1, 3, 5, 7];

export const CALL_TYPES = [
  { id: "call", label: "Phone Call" },
  { id: "whatsapp", label: "WhatsApp" },
  { id: "voicenote", label: "Voice Note" },
];

export const CALL_OUTCOMES = [
  { id: "connected", label: "Connected", color: "text-emerald-600" },
  { id: "no_answer", label: "No Answer", color: "text-amber-600" },
  { id: "busy", label: "Busy", color: "text-orange-600" },
  { id: "voicemail", label: "Voicemail", color: "text-violet-600" },
  { id: "completed", label: "Completed", color: "text-blue-600" },
];

export const SALESPERSONS = [
  "Adil",
  "Rahul",
  "Priya",
  "Sneha",
  "Karan",
];

export const SEED_SCRIPTS = [
  {
    title: "Course Introduction - WhatsApp",
    category: "Introduction",
    content: `Hi {name}! 👋

I'm {salesperson} from GrowthOS. I saw you were interested in our {course} program.

This course has helped 200+ students land jobs & start freelancing within 3 months.

Would you like to know more about the curriculum and how it can help you? I can share a quick overview!`,
    tags: ["whatsapp", "first-contact"],
    whatsappReady: true,
    isDefault: true,
  },
  {
    title: "Course Introduction - Call Script",
    category: "Introduction",
    content: `Opening:
"Hi {name}, this is {salesperson} from GrowthOS. I noticed you showed interest in our {course} program. Do you have 2 minutes?"

If yes:
"Great! So our {course} program is a {duration} hands-on course where you'll build real projects, get mentor support, and we even help with job placement."

Key points to mention:
• Live project-based learning
• 1-on-1 mentorship
• Placement assistance
• Flexible EMI options

Close:
"Would you like me to send you the detailed curriculum on WhatsApp?"`,
    tags: ["call", "first-contact"],
    whatsappReady: false,
    isDefault: true,
  },
  {
    title: "Day 1 Follow-up",
    category: "Follow-up",
    content: `Hi {name}! 😊

Just following up on our conversation about the {course} program.

I wanted to share that our next batch starts on {batchDate}. We only have {seats} seats left.

Do you have any questions I can help with?`,
    tags: ["whatsapp", "day-1", "follow-up"],
    whatsappReady: true,
    isDefault: true,
  },
  {
    title: "Day 3 Follow-up - Value Add",
    category: "Follow-up",
    content: `Hi {name}! 👋

I thought you might find this helpful — here's a success story of one of our recent {course} graduates:

🎯 {studentName} went from {before} to {after} in just {duration}.

Want me to connect you with them so you can hear directly about their experience?`,
    tags: ["whatsapp", "day-3", "social-proof"],
    whatsappReady: true,
    isDefault: true,
  },
  {
    title: "Day 5 Follow-up - Urgency",
    category: "Follow-up",
    content: `Hey {name}! 🔔

Quick update — our {course} batch is filling up fast. We're down to the last few seats.

I don't want you to miss out! Here's what you get:
✅ Lifetime access to course material
✅ 1-on-1 mentorship
✅ Job/freelance placement support
✅ EMI available starting ₹{emi}/month

Want to lock in your seat? I can help you get started right away!`,
    tags: ["whatsapp", "day-5", "urgency"],
    whatsappReady: true,
    isDefault: true,
  },
  {
    title: "Day 7 Follow-up - Last Chance",
    category: "Follow-up",
    content: `Hi {name},

This is my final follow-up about the {course} program. I understand timing matters, and I respect your decision either way.

If budget is a concern, we have flexible EMI options. If you have any other questions, I'm here to help.

Just reply "YES" if you'd like to enroll, or "LATER" if you want me to check back in a month. No pressure at all! 🙏`,
    tags: ["whatsapp", "day-7", "final"],
    whatsappReady: true,
    isDefault: true,
  },
  {
    title: "Closing Script - Payment Push",
    category: "Closing",
    content: `Hi {name}! 🎉

Great news — I've reserved a seat for you in the upcoming {course} batch!

Here's your payment link: {paymentLink}

💰 Full payment: ₹{price}
📅 EMI option: ₹{emi}/month (3 months)

The batch starts {batchDate}. Complete your payment to confirm your spot.

Any questions? I'm right here! 😊`,
    tags: ["whatsapp", "closing", "payment"],
    whatsappReady: true,
    isDefault: true,
  },
  {
    title: "Re-engagement Script",
    category: "General",
    content: `Hi {name}! 👋

It's been a while since we last spoke about the {course} program. Hope you're doing well!

We've recently updated the curriculum with some exciting new modules. Plus, we have a special offer running this week — {offer}.

Would you like to revisit the program? Happy to walk you through the updates!`,
    tags: ["whatsapp", "re-engagement"],
    whatsappReady: true,
    isDefault: true,
  },
];

export const SEED_OBJECTIONS = [
  {
    objection: "It's too expensive / I can't afford it",
    category: "Price",
    response: `I understand budget is important. Let me share a few things:

1. We offer EMI starting at ₹{emi}/month — that's less than your daily coffee!
2. Our average student earns back the course fee within 2 months of completing
3. Think of it as an investment — {studentName} invested ₹{price} and is now earning ₹{earning}/month

Would you like me to set up an EMI plan for you?`,
    tips: "Always reframe cost as investment. Share specific ROI examples. Never discount immediately — offer EMI first.",
    isDefault: true,
  },
  {
    objection: "I need to think about it",
    category: "Timing",
    response: `Absolutely, take your time! While you're deciding, let me ask — what specifically are you thinking about?

If it's about the course content, I can arrange a free demo class.
If it's about results, I can connect you with a graduate.
If it's about timing, our next batch starts {batchDate} and seats are limited.

What would help you make a decision?`,
    tips: "This objection usually hides the real concern. Ask probing questions to find the actual blocker.",
    isDefault: true,
  },
  {
    objection: "I found a cheaper course online",
    category: "Competition",
    response: `That's smart to compare! Here's what makes our program different:

🎯 Live classes (not recorded) with real-time doubt clearing
🤝 1-on-1 mentorship — you get a dedicated mentor
💼 Placement support — we actively help you get jobs/clients
🏗️ Real projects — you'll build {projects} that go in your portfolio
📜 Completion certificate recognized by companies

Most free/cheap courses have a 5% completion rate. Our completion rate is 85%+ because of our support system.

Would you like to see our curriculum comparison?`,
    tips: "Never badmouth competitors. Focus on unique value props. Emphasize support system and outcomes.",
    isDefault: true,
  },
  {
    objection: "I don't have time right now",
    category: "Timing",
    response: `I totally get it — everyone's busy! That's why we designed the program to be flexible:

⏰ Classes are on weekends (just 4-6 hrs/week)
📹 All sessions are recorded — watch anytime
📱 Learn at your own pace with our app
🗓️ Total duration: {duration} — you'll be done before you know it

Many of our working professional students manage it alongside their jobs. Would you like to see how the schedule works?`,
    tips: "Show flexibility. Emphasize weekend/evening options. Share examples of working professionals who completed the course.",
    isDefault: true,
  },
  {
    objection: "Will I actually get a job / earn money?",
    category: "Trust",
    response: `Great question! Here are the facts:

📊 85% of our graduates get placed or start earning within 3 months
💰 Average starting package/freelance income: ₹{earning}/month
🏆 {totalStudents}+ students trained so far

Here are some recent success stories:
• {story1}
• {story2}

I can also connect you with a recent graduate who can share their honest experience. Would you like that?`,
    tips: "Use specific numbers and real success stories. Offer to connect with alumni — this builds massive trust.",
    isDefault: true,
  },
  {
    objection: "Let me discuss with my family",
    category: "General",
    response: `Of course! Family's opinion matters. To help with the discussion, let me share:

📄 A detailed course brochure you can show them
🎥 A few student success story videos
💰 The EMI breakdown showing monthly investment

Would it help if I briefly spoke with them? Sometimes parents/partners have specific questions I can address directly.

When do you think you'll be able to discuss? I'll follow up after that.`,
    tips: "Offer to speak with family directly. Provide shareable materials. Set a specific follow-up date.",
    isDefault: true,
  },
  {
    objection: "I'll join the next batch",
    category: "Timing",
    response: `I hear that a lot, and honestly — most people who wait end up delaying even further. Here's why starting now is better:

🚀 The sooner you start, the sooner you start earning
🎁 We have a special offer for this batch: {offer}
📅 Next batch might be {nextBatchWeeks} weeks away
👥 This batch has great peer group energy

What if you enroll now and we give you early access to start with pre-course material?`,
    tips: "Create gentle urgency. Highlight what they'll miss. Offer early access as an incentive to commit now.",
    isDefault: true,
  },
];

export function formatDuration(seconds) {
  if (!seconds) return "—";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

export function getWhatsAppUrl(phone, message) {
  const cleaned = phone.replace(/[\s\-\(\)]/g, "");
  const num = cleaned.startsWith("+") ? cleaned.slice(1) : cleaned;
  return `https://wa.me/${num}?text=${encodeURIComponent(message)}`;
}
