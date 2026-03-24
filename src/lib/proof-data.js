export const TESTIMONIAL_TYPES = ["video", "text", "screenshot"];

export const TESTIMONIAL_STATUSES = ["pending", "approved", "published"];

export const TESTIMONIAL_TAGS = [
  "earnings",
  "projects",
  "placement",
  "skill",
  "transformation",
];

export const PLATFORMS = [
  "whatsapp",
  "instagram",
  "linkedin",
  "twitter",
  "direct",
  "other",
];

export const CASE_STUDY_STATUSES = ["draft", "published"];

export const TEMPLATE_CATEGORIES = [
  "social_post",
  "caption",
  "story",
  "reel_script",
  "whatsapp_broadcast",
];

export const TEMPLATE_PLATFORMS = [
  "instagram",
  "linkedin",
  "twitter",
  "facebook",
  "whatsapp",
  "universal",
];

export const TYPE_COLORS = {
  video: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400",
  text: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
  screenshot: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
};

export const STATUS_COLORS = {
  pending: "bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400",
  approved: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
  published: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
  draft: "bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400",
};

export const TAG_COLORS = {
  earnings: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400",
  projects: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
  placement: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400",
  skill: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  transformation: "bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-400",
};

export const PLATFORM_LABELS = {
  whatsapp: "WhatsApp",
  instagram: "Instagram",
  linkedin: "LinkedIn",
  twitter: "Twitter",
  facebook: "Facebook",
  direct: "Direct",
  other: "Other",
  universal: "Universal",
};

export const CATEGORY_LABELS = {
  social_post: "Social Post",
  caption: "Caption",
  story: "Story",
  reel_script: "Reel Script",
  whatsapp_broadcast: "WhatsApp Broadcast",
};

export function formatDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatCurrency(amount) {
  if (!amount) return "₹0";
  return `₹${Number(amount).toLocaleString("en-IN")}`;
}
