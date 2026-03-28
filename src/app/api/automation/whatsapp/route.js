import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Lead from "@/models/Lead";
import ChatMessage from "@/models/ChatMessage";
import { computeAndApplyScore } from "@/lib/lead-scoring";

function normalizePhone(raw) {
  if (!raw) return "";
  return raw.replace(/[^0-9+]/g, "").replace(/^0+/, "");
}

async function findOrCreateLead({ from, to, fromName, fromMe, source }) {
  const contactPhone = fromMe ? normalizePhone(to) : normalizePhone(from);
  const contactName = fromMe ? "" : (fromName || "");

  if (!contactPhone) return null;

  let lead = await Lead.findOne({
    phone: { $regex: contactPhone.replace(/^\+/, ""), $options: "i" },
  });

  if (!lead) {
    const leadData = {
      name: contactName || contactPhone,
      phone: contactPhone,
      source: "Organic",
      adSource: "",
      status: "new",
      tags: ["whatsapp"],
      timeline: [
        {
          type: "created",
          description: `Lead auto-created from WhatsApp (${source || "unknown"})`,
          createdAt: new Date(),
        },
      ],
    };
    computeAndApplyScore(leadData);
    lead = await Lead.create(leadData);
  }

  return lead;
}

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();

    if (Array.isArray(body)) {
      return handleBulk(body);
    }

    return handleSingle(body);
  } catch (err) {
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}

async function handleSingle(msg) {
  const { from_me, timestamp, source, body, from, to, from_name, type, audio_file, forwarded } = msg;

  if (!from && !to) {
    return NextResponse.json(
      { error: "Either 'from' or 'to' is required" },
      { status: 400 }
    );
  }

  const lead = await findOrCreateLead({
    from,
    to,
    fromName: from_name,
    fromMe: from_me,
    source,
  });

  if (!lead) {
    return NextResponse.json(
      { error: "Could not resolve contact phone number" },
      { status: 400 }
    );
  }

  const message = await ChatMessage.create({
    leadId: lead._id,
    fromMe: !!from_me,
    timestamp: timestamp || Math.floor(Date.now() / 1000),
    source: source || "",
    body: body || "",
    from: from || "",
    to: to || "",
    fromName: from_name || "",
    type: type || "text",
    audioFile: audio_file || "",
    forwarded: !!forwarded,
  });

  if (!from_me && lead.status === "new") {
    lead.status = "contacted";
    lead.timeline.push({
      type: "whatsapp_sent",
      description: `WhatsApp message received from ${from_name || from}`,
      createdAt: new Date(),
    });
    await lead.save();
  }

  return NextResponse.json(
    { success: true, leadId: lead._id, messageId: message._id, isNewLead: !lead.updatedAt || lead.createdAt.getTime() === lead.updatedAt.getTime() },
    { status: 201 }
  );
}

async function handleBulk(messages) {
  if (messages.length === 0) {
    return NextResponse.json({ error: "Empty array" }, { status: 400 });
  }
  if (messages.length > 1000) {
    return NextResponse.json(
      { error: "Maximum 1000 messages per request" },
      { status: 400 }
    );
  }

  const results = { processed: 0, leads_created: 0, errors: [] };
  const phoneToLead = new Map();

  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i];
    try {
      const contactPhone = msg.from_me
        ? normalizePhone(msg.to)
        : normalizePhone(msg.from);

      if (!contactPhone) {
        results.errors.push({ index: i, error: "No valid phone number" });
        continue;
      }

      let lead = phoneToLead.get(contactPhone);
      if (!lead) {
        lead = await findOrCreateLead({
          from: msg.from,
          to: msg.to,
          fromName: msg.from_name,
          fromMe: msg.from_me,
          source: msg.source,
        });
        if (lead) {
          phoneToLead.set(contactPhone, lead);
          if (
            lead.createdAt &&
            lead.updatedAt &&
            lead.createdAt.getTime() === lead.updatedAt.getTime()
          ) {
            results.leads_created++;
          }
        }
      }

      if (!lead) {
        results.errors.push({ index: i, error: "Could not resolve lead" });
        continue;
      }

      await ChatMessage.create({
        leadId: lead._id,
        fromMe: !!msg.from_me,
        timestamp: msg.timestamp || Math.floor(Date.now() / 1000),
        source: msg.source || "",
        body: msg.body || "",
        from: msg.from || "",
        to: msg.to || "",
        fromName: msg.from_name || "",
        type: msg.type || "text",
        audioFile: msg.audio_file || "",
        forwarded: !!msg.forwarded,
      });

      results.processed++;
    } catch (err) {
      results.errors.push({ index: i, error: err.message });
    }
  }

  return NextResponse.json(results, { status: 201 });
}
