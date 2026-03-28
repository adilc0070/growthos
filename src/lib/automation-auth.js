import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

const ROLE_ALLOW = ["admin", "sales"];

function getProvidedSecret(request) {
  const auth = request.headers.get("authorization") || "";
  const bearer =
    auth.toLowerCase().startsWith("bearer ")
      ? auth.slice(7).trim()
      : "";
  const header =
    request.headers.get("x-automation-secret") ||
    request.headers.get("x-webhook-secret") ||
    "";
  return bearer || header.trim();
}

/**
 * Allows either a logged-in admin/sales user (browser / same-origin)
 * or a matching AUTOMATION_API_SECRET (external webhooks / tools).
 */
export async function requireAutomationOrSession(request) {
  const session = await getSession();
  if (session?.user?.role && ROLE_ALLOW.includes(session.user.role)) {
    return { ok: true };
  }

  const configured = process.env.AUTOMATION_API_SECRET?.trim();
  const provided = getProvidedSecret(request);

  if (configured) {
    if (!provided) {
      return {
        ok: false,
        error: NextResponse.json(
          {
            error:
              "Unauthorized. Send Authorization: Bearer <secret> or X-Automation-Secret header, or sign in as admin/sales.",
          },
          { status: 401 }
        ),
      };
    }
    if (provided !== configured) {
      return {
        ok: false,
        error: NextResponse.json(
          { error: "Invalid automation secret" },
          { status: 403 }
        ),
      };
    }
    return { ok: true };
  }

  if (!session) {
    return {
      ok: false,
      error: NextResponse.json(
        {
          error:
            "Unauthorized. Set AUTOMATION_API_SECRET and send Bearer secret for webhooks, or sign in as admin/sales.",
        },
        { status: 401 }
      ),
    };
  }

  return {
    ok: false,
    error: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
  };
}
