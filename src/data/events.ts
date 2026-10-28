export type GigEvent = {
  id: string;
  /** ISO date (YYYY-MM-DD). Upcoming/past is derived from this at render time. */
  date: string;
  name: string;
  venue: string;
  city: string;
  kind: "Club" | "Festival" | "Student" | "Bar";
  ticketUrl?: string;
  soldOut?: boolean;
};

// PLACEHOLDER AGENDA — venues are real, dates are illustrative.
// Replace with the confirmed agenda (or move to the Supabase `events` table).
export const events: GigEvent[] = [
  { id: "e1", date: "2026-11-14", name: "Hard Night", venue: "Club Havana", city: "Mol", kind: "Club" },
  { id: "e2", date: "2026-11-28", name: "Delirium Late Session", venue: "Cafe De Delirium", city: "Gent", kind: "Bar" },
  { id: "e3", date: "2026-12-12", name: "Student Kick-Off", venue: "TBA", city: "Leuven", kind: "Student" },
  { id: "e4", date: "2026-12-31", name: "NYE Rave", venue: "Jeugdhuis De Mans", city: "Belgium", kind: "Club", soldOut: true },
  { id: "p1", date: "2026-09-20", name: "Back To School", venue: "Huis de Rand", city: "Leuven", kind: "Student" },
  { id: "p2", date: "2026-08-08", name: "Summer Festival — Techno Stage", venue: "Festival grounds", city: "Belgium", kind: "Festival" },
  { id: "p3", date: "2026-06-13", name: "Hard Trance Special", venue: "Club Havana", city: "Mol", kind: "Club" },
  { id: "p4", date: "2026-04-25", name: "90s vs Jumpstyle", venue: "Jeugdhuis De Mans", city: "Belgium", kind: "Club" },
  { id: "p5", date: "2026-03-07", name: "Delirium Takeover", venue: "Cafe De Delirium", city: "Gent", kind: "Bar" },
];

export function splitEvents(list: GigEvent[], now = new Date()) {
  const today = now.toISOString().slice(0, 10);
  const upcoming = list.filter((e) => e.date >= today).sort((a, b) => a.date.localeCompare(b.date));
  const past = list.filter((e) => e.date < today).sort((a, b) => b.date.localeCompare(a.date));
  return { upcoming, past };
}
