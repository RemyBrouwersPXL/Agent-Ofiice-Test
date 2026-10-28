import { NextResponse } from "next/server";
import { sanitizeBooking, validateBooking } from "@/lib/booking";
import { getServerSupabase } from "@/lib/supabase";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const data = sanitizeBooking(body);

  // Honeypot filled → pretend success so bots don't retry.
  if (data.website) return NextResponse.json({ ok: true });

  const errors = validateBooking(data);
  if (Object.keys(errors).length) return NextResponse.json({ ok: false, errors }, { status: 422 });

  const supabase = getServerSupabase();
  if (!supabase) {
    // No backend yet: log so requests aren't silently lost in dev.
    console.info("[booking] Supabase not configured — request received:", data);
    return NextResponse.json({ ok: true, stored: false });
  }

  const { website: _honeypot, ...row } = data;
  const { error } = await supabase.from("booking_requests").insert({
    event_type: row.eventType,
    event_date: row.date,
    start_time: row.startTime || null,
    set_length: row.setLength,
    venue: row.venue || null,
    city: row.city,
    crowd_size: row.crowd || null,
    extra: row.extra || null,
    genres: row.genres,
    budget: row.budget || null,
    name: row.name,
    email: row.email,
    phone: row.phone || null,
    organisation: row.organisation || null,
    message: row.message || null,
  });

  if (error) {
    console.error("[booking] insert failed", error);
    return NextResponse.json({ ok: false, error: "Could not save your request. Please email us instead." }, { status: 500 });
  }

  // Phase 2 hook: send a notification (Resend / Supabase function) here.
  return NextResponse.json({ ok: true, stored: true });
}
