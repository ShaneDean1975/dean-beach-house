/**
 * Booking relay: receives the site's booking-form submission and creates
 * the entry in Wufoo through its REST API (no captcha / second page).
 * The Wufoo API key lives in the WUFOO_API_KEY secret — never in the site.
 */

const WUFOO_ENDPOINT =
  "https://deancamper.wufoo.com/api/v3/forms/sbzzrox09unjge/entries.json";

const ALLOWED_ORIGINS = [
  "https://gulf-shores-beach-house.com",
  "https://www.gulf-shores-beach-house.com",
  "http://localhost:4321",
];

// Only these Wufoo fields are forwarded.
const FIELDS = [
  "Field1", "Field2", "Field3",            // first, last, email
  "Field4", "Field4-1", "Field4-2",        // phone 3/3/4
  "Field5-1", "Field5-2", "Field5",        // check-in MM/DD/YYYY
  "Field6-1", "Field6-2", "Field6",        // check-out MM/DD/YYYY
  "Field10",                               // guests
];

function corsHeaders(origin) {
  const allow = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const headers = corsHeaders(origin);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers });
    }
    if (request.method !== "POST") {
      return new Response(JSON.stringify({ ok: false, error: "POST only" }),
        { status: 405, headers });
    }
    if (!ALLOWED_ORIGINS.includes(origin)) {
      return new Response(JSON.stringify({ ok: false, error: "bad origin" }),
        { status: 403, headers });
    }

    let data;
    try { data = await request.json(); }
    catch { return new Response(JSON.stringify({ ok: false, error: "bad body" }),
      { status: 400, headers }); }

    // Honeypot: real visitors never fill this hidden field.
    if (data.website) {
      return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
    }

    const body = new URLSearchParams();
    for (const f of FIELDS) {
      const v = (data[f] ?? "").toString().slice(0, 255);
      if (v) body.set(f, v);
    }
    if (!body.get("Field1") || !body.get("Field3")) {
      return new Response(JSON.stringify({ ok: false, error: "missing name/email" }),
        { status: 400, headers });
    }

    const resp = await fetch(WUFOO_ENDPOINT, {
      method: "POST",
      headers: {
        "Authorization": "Basic " + btoa(env.WUFOO_API_KEY + ":relay"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    });

    let out = {};
    try { out = await resp.json(); } catch { /* fall through */ }

    if (out.Success === 1) {
      return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
    }
    const detail = out.ErrorText ||
      (out.FieldErrors && out.FieldErrors.map(e => e.ErrorText).join("; ")) ||
      ("wufoo status " + resp.status);
    return new Response(JSON.stringify({ ok: false, error: detail }),
      { status: 502, headers });
  },
};
