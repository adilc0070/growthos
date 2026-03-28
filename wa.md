## API Documentation

---

### 1. Single WhatsApp Message

**Endpoint:** `POST /api/automation/whatsapp`

**Request:**
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

**Error Response (400):**
```json
{
  "error": "Either 'from' or 'to' is required"
}
```

---

### 2. Bulk WhatsApp Messages

**Endpoint:** `POST /api/automation/whatsapp`

**Request:**
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

**Response with partial errors (201):**
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

**Error Response (400):**
```json
{
  "error": "Maximum 1000 messages per request"
}
```

---

### 3. Get Chat Messages for a Lead

**Endpoint:** `GET /api/leads/:id/messages`

**Headers:** Requires authenticated session (admin or sales role)

**Request:** No body — just the lead ID in the URL.

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

**Error Response (401):**
```json
{
  "error": "Unauthorized"
}
```

---

### Quick Reference

| # | Method | Endpoint | Auth | Purpose |
|---|--------|----------|------|---------|
| 1 | `POST` | `/api/automation/whatsapp` | None | Single message — auto-creates lead if new |
| 2 | `POST` | `/api/automation/whatsapp` | None | Bulk messages (send array) — up to 1000 |
| 3 | `GET` | `/api/leads/:id/messages` | Admin/Sales | Fetch all chat messages for a lead |

The automation endpoint has no auth so external WhatsApp webhook services can call it directly. The messages read endpoint requires login.