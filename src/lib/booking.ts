/** Booking request schema + validation, shared by the form (client) and the API route (server). */

export const EVENT_TYPES = ["Club", "Festival", "Student", "Private", "Bar", "Other"] as const;
export const SET_LENGTHS = ["1h", "1.5h", "2h", "3h", "4h+"] as const;
export const CROWD_SIZES = ["< 100", "100–300", "300–750", "750–2000", "2000+"] as const;
export const BUDGETS = ["Let's discuss", "< €300", "€300–600", "€600–1200", "€1200+"] as const;

export type BookingRequest = {
  eventType: (typeof EVENT_TYPES)[number] | "";
  date: string;
  startTime: string;
  setLength: (typeof SET_LENGTHS)[number] | "";
  venue: string;
  city: string;
  crowd: (typeof CROWD_SIZES)[number] | "";
  /** Conditional: festival stage / student association / private occasion. */
  extra: string;
  genres: string[];
  budget: (typeof BUDGETS)[number] | "";
  name: string;
  email: string;
  phone: string;
  organisation: string;
  message: string;
  /** Honeypot — must stay empty. */
  website: string;
};

export const emptyBooking: BookingRequest = {
  eventType: "",
  date: "",
  startTime: "",
  setLength: "",
  venue: "",
  city: "",
  crowd: "",
  extra: "",
  genres: [],
  budget: "",
  name: "",
  email: "",
  phone: "",
  organisation: "",
  message: "",
  website: "",
};

export type BookingErrors = Partial<Record<keyof BookingRequest, string>>;

export const STEP_FIELDS: (keyof BookingRequest)[][] = [
  ["eventType", "date", "startTime", "setLength", "venue", "city", "crowd", "extra"],
  ["genres", "budget"],
  ["name", "email", "phone", "organisation", "message"],
];

export function extraFieldLabel(type: BookingRequest["eventType"]) {
  switch (type) {
    case "Festival":
      return "Festival name & stage";
    case "Student":
      return "Student association / faculty";
    case "Private":
      return "Occasion (birthday, wedding, corporate…)";
    default:
      return null;
  }
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const todayISO = () => new Date().toISOString().slice(0, 10);

export function validateBooking(data: BookingRequest, fields?: (keyof BookingRequest)[]): BookingErrors {
  const e: BookingErrors = {};
  const check = (k: keyof BookingRequest) => !fields || fields.includes(k);

  if (check("eventType") && !EVENT_TYPES.includes(data.eventType as never)) e.eventType = "Pick an event type";
  if (check("date")) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(data.date)) e.date = "Pick a date";
    else if (data.date < todayISO()) e.date = "Date is in the past";
  }
  if (check("setLength") && !SET_LENGTHS.includes(data.setLength as never)) e.setLength = "Choose a set length";
  if (check("city") && data.city.trim().length < 2) e.city = "Where is it?";
  if (check("extra") && extraFieldLabel(data.eventType) && data.extra.trim().length < 2) e.extra = "Tell us a bit more";
  if (check("name") && data.name.trim().length < 2) e.name = "Your name";
  if (check("email") && !EMAIL_RE.test(data.email.trim())) e.email = "A valid email, please";
  if (check("phone") && data.phone && !/^[+\d\s()./-]{6,20}$/.test(data.phone)) e.phone = "Check the number";
  if (check("message") && data.message.length > 2000) e.message = "Keep it under 2000 characters";
  return e;
}

/** Strips unknown keys and trims strings — the server never trusts the client shape. */
export function sanitizeBooking(input: unknown): BookingRequest {
  const src = (typeof input === "object" && input ? input : {}) as Record<string, unknown>;
  const out = { ...emptyBooking };
  for (const key of Object.keys(emptyBooking) as (keyof BookingRequest)[]) {
    const v = src[key];
    if (key === "genres") out.genres = Array.isArray(v) ? v.filter((g): g is string => typeof g === "string").slice(0, 12) : [];
    else if (typeof v === "string") (out as Record<string, unknown>)[key] = v.trim().slice(0, 2000);
  }
  return out;
}
