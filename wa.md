## WhatsApp automation API

---

### Authentication

Both `POST /api/automation/whatsapp` and `GET /api/leads/:id/messages` use the same rules.

**Option A — Browser (in-app)**  
Signed in as **admin** or **sales**. Session cookies are sent automatically for same-origin requests (e.g. Leads page, Chat tab, WhatsApp Upload modal).

**Option B — Server / webhook (no browser)**  
Set `AUTOMATION_API_SECRET` in `.env.local` (or your host’s env) to a long random string. Send that value using **one** of:

| Header | Example |
|--------|---------|
| `Authorization` | `Bearer <AUTOMATION_API_SECRET>` |
| `X-Automation-Secret` | `<AUTOMATION_API_SECRET>` |
| `X-Webhook-Secret` | `<AUTOMATION_API_SECRET>` |

If `AUTOMATION_API_SECRET` is **set**, callers without a valid admin/sales session **must** send the secret. Wrong secret → **403**; missing secret → **401**.

If `AUTOMATION_API_SECRET` is **not** set, only signed-in admin/sales can call these routes (webhooks should set the secret in production).

---

### 1. Single WhatsApp message

**Endpoint:** `POST /api/automation/whatsapp`

**Headers (webhook):**
```http
Content-Type: application/json
Authorization: Bearer <AUTOMATION_API_SECRET>
```

**Request body:**
```json
{
  "from_me": false,
  "timestamp": 1774545318,
  "source": "UAV/CAN",
  "body": "Hi, I want to know about your Full Stack course",
  "from": "+919876543210",
  "to": "+911234567890",
  "from_name": "Rahul Sharma",
  "type": "text",
  "audio_file": "",
  "forwarded": false
}
```

**Response (201):**
```json
{
  "success": true,
  "leadId": "6836a1b2c4e5f7890abcdef1",
  "messageId": "6836a1b2c4e5f7890abcdef2",
  "isNewLead": true
}
```

**Error (400):**
```json
{
  "error": "Either 'from' or 'to' is required"
}
```

**Error (401) — missing auth when secret is configured:**
```json
{
  "error": "Unauthorized. Send Authorization: Bearer <secret> or X-Automation-Secret header, or sign in as admin/sales."
}
```

**Error (403) — wrong secret:**
```json
{
  "error": "Invalid automation secret"
}
```

---

### 2. Bulk WhatsApp messages

**Endpoint:** `POST /api/automation/whatsapp` (same URL; body is a **JSON array**)

**Headers:** Same as single message (session or `Authorization` / secret headers).

**Request body:**
```json
[
  {
    "from_me": false,
    "timestamp": 1774545318,
    "source": "UAV/CAN",
    "body": "Hi, I want to know about your course",
    "from": "+919876543210",
    "to": "+911234567890",
    "from_name": "Rahul Sharma",
    "type": "text",
    "audio_file": "",
    "forwarded": false
  },
  {
    "from_me": true,
    "timestamp": 1774545400,
    "source": "UAV/CAN",
    "body": "Hi Rahul! Sure, let me share the details.",
    "from": "+911234567890",
    "to": "+919876543210",
    "from_name": "",
    "type": "text",
    "audio_file": "",
    "forwarded": false
  },
  {
    "from_me": false,
    "timestamp": 1774546000,
    "source": "UAV/CAN",
    "body": "Hello, I saw your Instagram ad",
    "from": "+918765432109",
    "to": "+911234567890",
    "from_name": "Priya Patel",
    "type": "text",
    "audio_file": "",
    "forwarded": false
  }
]
```

**Response (201):**
```json
{
  "processed": 3,
  "leads_created": 2,
  "errors": []
}
```

**Response (201) with per-row errors:**
```json
{
  "processed": 2,
  "leads_created": 1,
  "errors": [
    {
      "index": 2,
      "error": "No valid phone number"
    }
  ]
}
```

**Error (400):**
```json
{
  "error": "Maximum 1000 messages per request"
}
```

---

### 3. Get chat messages for a lead

**Endpoint:** `GET /api/leads/:id/messages`

**Headers (webhook / API client):**
```http
Authorization: Bearer <AUTOMATION_API_SECRET>
```

**Request:** No body. Lead ID in the path, for example:

```
GET /api/leads/6836a1b2c4e5f7890abcdef1/messages
```

**Response (200):**
```json
[
  {
    "_id": "6836a1b2c4e5f7890abc0001",
    "leadId": "6836a1b2c4e5f7890abcdef1",
    "fromMe": false,
    "timestamp": 1774545318,
    "source": "UAV/CAN",
    "body": "Hi, I want to know about your course",
    "from": "+919876543210",
    "to": "+911234567890",
    "fromName": "Rahul Sharma",
    "type": "text",
    "audioFile": "",
    "forwarded": false,
    "createdAt": "2026-03-28T12:00:00.000Z",
    "updatedAt": "2026-03-28T12:00:00.000Z",
    "id": "6836a1b2c4e5f7890abc0001"
  },
  {
    "_id": "6836a1b2c4e5f7890abc0002",
    "leadId": "6836a1b2c4e5f7890abcdef1",
    "fromMe": true,
    "timestamp": 1774545400,
    "source": "UAV/CAN",
    "body": "Hi Rahul! Sure, let me share the details.",
    "from": "+911234567890",
    "to": "+919876543210",
    "fromName": "",
    "type": "text",
    "audioFile": "",
    "forwarded": false,
    "createdAt": "2026-03-28T12:01:00.000Z",
    "updatedAt": "2026-03-28T12:01:00.000Z",
    "id": "6836a1b2c4e5f7890abc0002"
  }
]
```

**Error (401 / 403):** Same patterns as section 1 (missing or invalid secret, or not admin/sales when secret is unset).

---

### Quick reference

| # | Method | Endpoint | Auth | Purpose |
|---|--------|----------|------|---------|
| 1 | `POST` | `/api/automation/whatsapp` | Session (admin/sales) **or** `AUTOMATION_API_SECRET` | Single message object — auto-creates lead if needed |
| 2 | `POST` | `/api/automation/whatsapp` | Same | Bulk: JSON array, max 1000 messages |
| 3 | `GET` | `/api/leads/:id/messages` | Same | List chat messages for a lead (oldest first) |

**Environment:** `AUTOMATION_API_SECRET` in `.env.local` (or deployment env). Use a strong random value in production; never commit real secrets to git.
