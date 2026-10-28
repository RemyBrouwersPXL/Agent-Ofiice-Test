/**
 * Single source of truth for artist content.
 * The artist name is always rendered as "RYM" — never lowercase or title case.
 */
export const ARTIST_NAME = "RYM" as const;

export const artist = {
  name: ARTIST_NAME,
  displayName: `DJ ${ARTIST_NAME}`,
  age: 20,
  yearsActive: 10,
  startedAtAge: 10,
  origin: "Belgium",
  tagline: "Hard Trance · Hard Techno · Club",
  genres: [
    "Hard Trance",
    "Hard Techno",
    "Techno",
    "Club Music",
    "House",
    "Tech House",
    "90s Dance",
    "Jumpstyle",
  ],
  venues: [
    { name: "Club Havana", city: "Mol" },
    { name: "Jeugdhuis De Mans", city: null },
    { name: "Huis de Rand", city: "Leuven" },
    { name: "Cafe De Delirium", city: "Gent" },
  ],
  bio: [
    `${ARTIST_NAME} stepped behind the decks at ten years old. A decade later, at twenty, that head start shows: a reflex for reading a room that most DJs spend years chasing.`,
    `Sets move from rolling house and tech house warm-ups to relentless hard techno and euphoric hard trance, with 90s dance and jumpstyle edits kept ready for the moment a crowd needs to go off.`,
    `From Club Havana in Mol to Cafe De Delirium in Gent, plus festivals and student events across Belgium, ${ARTIST_NAME} brings the same thing every time: pressure, precision and no dead air.`,
  ],
  stats: [
    { value: 10, suffix: "", label: "Years behind the decks" },
    { value: 8, suffix: "", label: "Genres in rotation" },
    { value: 3, suffix: "", label: "Original releases" },
    { value: 20, suffix: "", label: "Years old" },
  ],
  bookingEmail: "bookings@djrym.be", // TODO: confirm real booking address
} as const;

export type Genre = (typeof artist.genres)[number];
