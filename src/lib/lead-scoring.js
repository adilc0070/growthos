const BUDGET_MAP = {
  "": 0,
  below_10k: 10,
  "10k_20k": 25,
  "20k_30k": 40,
  "30k_50k": 55,
  above_50k: 70,
};

function parseBudgetNumber(budgetStr) {
  if (!budgetStr) return 0;
  const num = parseInt(budgetStr.replace(/[^\d]/g, ""), 10);
  return isNaN(num) ? 0 : num;
}

function scoreBudget(lead) {
  if (lead.qualificationData?.budgetRange) {
    return BUDGET_MAP[lead.qualificationData.budgetRange] ?? 0;
  }
  const amount = parseBudgetNumber(lead.budget);
  if (amount >= 50000) return 70;
  if (amount >= 30000) return 55;
  if (amount >= 20000) return 40;
  if (amount >= 10000) return 25;
  if (amount > 0) return 10;
  return 0;
}

const URGENCY_SCORES = { low: 0, medium: 30, high: 60, urgent: 90 };

function scoreUrgency(lead) {
  let base = URGENCY_SCORES[lead.urgency] ?? 0;

  if (lead.qualificationData?.timeline) {
    const timeBonus = {
      immediate: 40,
      "1_month": 25,
      "3_months": 15,
      "6_months": 5,
      exploring: 0,
    };
    base = Math.max(base, timeBonus[lead.qualificationData.timeline] ?? 0);
  }

  if (lead.status === "payment_pending") base = Math.max(base, 70);
  if (lead.status === "interested") base = Math.max(base, 40);

  return Math.min(base, 100);
}

const ENGAGEMENT_SCORES = { none: 0, low: 20, medium: 50, high: 80 };

function scoreEngagement(lead) {
  let base = ENGAGEMENT_SCORES[lead.engagement] ?? 0;

  const noteCount = lead.notes?.length ?? 0;
  const timelineCount = lead.timeline?.length ?? 0;
  const interactionBonus = Math.min((noteCount + timelineCount) * 5, 30);
  base = Math.max(base, interactionBonus);

  if (lead.qualificationData?.qualifiedAt) base = Math.max(base, 40);

  return Math.min(base, 100);
}

export function calculateLeadScore(lead) {
  const budget = scoreBudget(lead);
  const urgency = scoreUrgency(lead);
  const engagement = scoreEngagement(lead);

  const overall = Math.round(budget * 0.3 + urgency * 0.35 + engagement * 0.35);

  return {
    budget,
    urgency,
    engagement,
    overall: Math.min(overall, 100),
  };
}

export function deriveTemperature(score) {
  if (score >= 65) return "hot";
  if (score >= 35) return "warm";
  return "cold";
}

export function autoDetectPersona(lead) {
  if (lead.persona) return lead.persona;

  const text = [
    lead.courseInterest,
    ...(lead.tags || []),
    ...(lead.notes || []).map((n) => n.text),
    lead.qualificationData?.currentSituation,
    lead.qualificationData?.goal,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (/freelanc/i.test(text)) return "freelancer";
  if (/job|placement|hire|career|switch/i.test(text)) return "job_seeker";
  if (/business|agency|startup|company|scale/i.test(text)) return "business_owner";
  if (/work|professional|corporate|tcs|infosys|wipro/i.test(text)) return "working_professional";
  if (/student|college|learn|beginner/i.test(text)) return "student";

  return "";
}

export function computeAndApplyScore(lead) {
  const scores = calculateLeadScore(lead);
  lead.leadScore = scores.overall;
  lead.temperature = deriveTemperature(scores.overall);
  if (!lead.persona) {
    const detected = autoDetectPersona(lead);
    if (detected) lead.persona = detected;
  }
  return scores;
}
