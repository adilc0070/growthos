export const STATUSES = [
  { id: "new", label: "New", color: "bg-blue-500", lightBg: "bg-blue-50 dark:bg-blue-950/40", text: "text-blue-700 dark:text-blue-300", border: "border-blue-200 dark:border-blue-800" },
  { id: "contacted", label: "Contacted", color: "bg-amber-500", lightBg: "bg-amber-50 dark:bg-amber-950/40", text: "text-amber-700 dark:text-amber-300", border: "border-amber-200 dark:border-amber-800" },
  { id: "interested", label: "Interested", color: "bg-violet-500", lightBg: "bg-violet-50 dark:bg-violet-950/40", text: "text-violet-700 dark:text-violet-300", border: "border-violet-200 dark:border-violet-800" },
  { id: "payment_pending", label: "Payment Pending", color: "bg-orange-500", lightBg: "bg-orange-50 dark:bg-orange-950/40", text: "text-orange-700 dark:text-orange-300", border: "border-orange-200 dark:border-orange-800" },
  { id: "converted", label: "Converted", color: "bg-emerald-500", lightBg: "bg-emerald-50 dark:bg-emerald-950/40", text: "text-emerald-700 dark:text-emerald-300", border: "border-emerald-200 dark:border-emerald-800" },
  { id: "dropped", label: "Dropped", color: "bg-red-500", lightBg: "bg-red-50 dark:bg-red-950/40", text: "text-red-700 dark:text-red-300", border: "border-red-200 dark:border-red-800" },
];

export const SOURCES = ["Ads", "Organic", "Referral"];

export const COURSES = [
  "Full Stack Development",
  "Digital Marketing",
  "UI/UX Design",
  "Data Science",
  "Freelancing Mastery",
];

export function generateId() {
  return Math.random().toString(36).slice(2, 10);
}

export function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(iso) {
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function isOverdue(dateStr) {
  if (!dateStr) return false;
  return new Date(dateStr) < new Date(new Date().toDateString());
}

export const MOCK_LEADS = [
  {
    id: "1",
    name: "Rahul Sharma",
    phone: "+91 98765 43210",
    email: "rahul@example.com",
    source: "Ads",
    status: "new",
    budget: "₹15,000",
    courseInterest: "Full Stack Development",
    tags: ["hot-lead", "student"],
    notes: [{ id: "n1", text: "Inquired via Instagram ad, seems motivated", createdAt: "2026-03-20T10:30:00Z" }],
    timeline: [{ id: "t1", type: "created", description: "Lead captured from Instagram ad form", createdAt: "2026-03-20T10:00:00Z" }],
    followUpDate: "2026-03-26",
    createdAt: "2026-03-20T10:00:00Z",
  },
  {
    id: "2",
    name: "Priya Patel",
    phone: "+91 87654 32109",
    email: "priya@example.com",
    source: "Organic",
    status: "contacted",
    budget: "₹20,000",
    courseInterest: "Digital Marketing",
    tags: ["freelancer"],
    notes: [
      { id: "n1", text: "Very interested, asked about EMI options", createdAt: "2026-03-21T14:00:00Z" },
      { id: "n2", text: "Sent EMI details on WhatsApp", createdAt: "2026-03-22T11:00:00Z" },
    ],
    timeline: [
      { id: "t1", type: "created", description: "Lead created from YouTube comment", createdAt: "2026-03-19T09:00:00Z" },
      { id: "t2", type: "status_change", description: "Status changed to Contacted", createdAt: "2026-03-21T14:00:00Z" },
    ],
    followUpDate: "2026-03-25",
    createdAt: "2026-03-19T09:00:00Z",
  },
  {
    id: "3",
    name: "Amit Kumar",
    phone: "+91 76543 21098",
    email: "amit.k@example.com",
    source: "Referral",
    status: "interested",
    budget: "₹25,000",
    courseInterest: "Full Stack Development",
    tags: ["job-seeker", "referred-by-student"],
    notes: [{ id: "n1", text: "Referred by Vikram (batch 12). Strong intent.", createdAt: "2026-03-18T16:00:00Z" }],
    timeline: [
      { id: "t1", type: "created", description: "Referral from Vikram (existing student)", createdAt: "2026-03-17T10:00:00Z" },
      { id: "t2", type: "status_change", description: "Status changed to Contacted", createdAt: "2026-03-18T12:00:00Z" },
      { id: "t3", type: "status_change", description: "Status changed to Interested", createdAt: "2026-03-18T16:00:00Z" },
    ],
    followUpDate: "2026-03-27",
    createdAt: "2026-03-17T10:00:00Z",
  },
  {
    id: "4",
    name: "Sneha Reddy",
    phone: "+91 65432 10987",
    email: "sneha.r@example.com",
    source: "Ads",
    status: "payment_pending",
    budget: "₹18,000",
    courseInterest: "UI/UX Design",
    tags: ["student", "design-background"],
    notes: [
      { id: "n1", text: "Ready to pay, waiting for salary credit on 1st", createdAt: "2026-03-22T09:00:00Z" },
    ],
    timeline: [
      { id: "t1", type: "created", description: "Lead from Facebook ad", createdAt: "2026-03-15T11:00:00Z" },
      { id: "t2", type: "status_change", description: "Status changed to Contacted", createdAt: "2026-03-16T10:00:00Z" },
      { id: "t3", type: "status_change", description: "Status changed to Interested", createdAt: "2026-03-18T14:00:00Z" },
      { id: "t4", type: "status_change", description: "Status changed to Payment Pending", createdAt: "2026-03-22T09:00:00Z" },
    ],
    followUpDate: "2026-04-01",
    createdAt: "2026-03-15T11:00:00Z",
  },
  {
    id: "5",
    name: "Vikram Singh",
    phone: "+91 54321 09876",
    email: "vikram.s@example.com",
    source: "Organic",
    status: "converted",
    budget: "₹22,000",
    courseInterest: "Full Stack Development",
    tags: ["job-seeker"],
    notes: [{ id: "n1", text: "Enrolled in Batch 14. Payment received via Razorpay.", createdAt: "2026-03-10T15:00:00Z" }],
    timeline: [
      { id: "t1", type: "created", description: "DM on Twitter", createdAt: "2026-03-01T09:00:00Z" },
      { id: "t2", type: "status_change", description: "Status changed to Contacted", createdAt: "2026-03-02T11:00:00Z" },
      { id: "t3", type: "status_change", description: "Status changed to Interested", createdAt: "2026-03-05T10:00:00Z" },
      { id: "t4", type: "status_change", description: "Status changed to Payment Pending", createdAt: "2026-03-08T14:00:00Z" },
      { id: "t5", type: "status_change", description: "Status changed to Converted", createdAt: "2026-03-10T15:00:00Z" },
    ],
    followUpDate: null,
    createdAt: "2026-03-01T09:00:00Z",
  },
  {
    id: "6",
    name: "Ananya Gupta",
    phone: "+91 43210 98765",
    email: "ananya@example.com",
    source: "Ads",
    status: "new",
    budget: "₹10,000",
    courseInterest: "Freelancing Mastery",
    tags: ["student", "budget-conscious"],
    notes: [],
    timeline: [{ id: "t1", type: "created", description: "Lead from Google ad", createdAt: "2026-03-24T08:00:00Z" }],
    followUpDate: "2026-03-26",
    createdAt: "2026-03-24T08:00:00Z",
  },
  {
    id: "7",
    name: "Karan Mehta",
    phone: "+91 32109 87654",
    email: "karan.m@example.com",
    source: "Referral",
    status: "contacted",
    budget: "₹30,000",
    courseInterest: "Data Science",
    tags: ["working-professional"],
    notes: [{ id: "n1", text: "Works at TCS, wants to switch to data role", createdAt: "2026-03-23T17:00:00Z" }],
    timeline: [
      { id: "t1", type: "created", description: "Referral from LinkedIn post", createdAt: "2026-03-22T10:00:00Z" },
      { id: "t2", type: "status_change", description: "Status changed to Contacted", createdAt: "2026-03-23T17:00:00Z" },
    ],
    followUpDate: "2026-03-28",
    createdAt: "2026-03-22T10:00:00Z",
  },
  {
    id: "8",
    name: "Deepika Joshi",
    phone: "+91 21098 76543",
    email: "deepika.j@example.com",
    source: "Organic",
    status: "dropped",
    budget: "₹12,000",
    courseInterest: "Digital Marketing",
    tags: ["student"],
    notes: [{ id: "n1", text: "Budget too low, couldn't afford. Might revisit later.", createdAt: "2026-03-20T13:00:00Z" }],
    timeline: [
      { id: "t1", type: "created", description: "Inquiry via website form", createdAt: "2026-03-14T10:00:00Z" },
      { id: "t2", type: "status_change", description: "Status changed to Contacted", createdAt: "2026-03-15T11:00:00Z" },
      { id: "t3", type: "status_change", description: "Status changed to Dropped", createdAt: "2026-03-20T13:00:00Z" },
    ],
    followUpDate: null,
    createdAt: "2026-03-14T10:00:00Z",
  },
  {
    id: "9",
    name: "Rohan Nair",
    phone: "+91 10987 65432",
    email: "rohan.n@example.com",
    source: "Ads",
    status: "new",
    budget: "₹17,000",
    courseInterest: "UI/UX Design",
    tags: ["student"],
    notes: [],
    timeline: [{ id: "t1", type: "created", description: "Lead from Instagram story ad", createdAt: "2026-03-25T07:00:00Z" }],
    followUpDate: "2026-03-27",
    createdAt: "2026-03-25T07:00:00Z",
  },
  {
    id: "10",
    name: "Meera Iyer",
    phone: "+91 09876 54321",
    email: "meera.i@example.com",
    source: "Organic",
    status: "interested",
    budget: "₹28,000",
    courseInterest: "Data Science",
    tags: ["working-professional", "hot-lead"],
    notes: [
      { id: "n1", text: "Strong intent, comparing with other courses", createdAt: "2026-03-23T10:00:00Z" },
      { id: "n2", text: "Sent comparison doc and success stories", createdAt: "2026-03-24T09:00:00Z" },
    ],
    timeline: [
      { id: "t1", type: "created", description: "Found via blog post", createdAt: "2026-03-20T08:00:00Z" },
      { id: "t2", type: "status_change", description: "Status changed to Contacted", createdAt: "2026-03-21T11:00:00Z" },
      { id: "t3", type: "status_change", description: "Status changed to Interested", createdAt: "2026-03-23T10:00:00Z" },
    ],
    followUpDate: "2026-03-26",
    createdAt: "2026-03-20T08:00:00Z",
  },
];
