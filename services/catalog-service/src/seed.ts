import { pool } from "./db";

/**
 * Gradients + icon give every event a polished, consistent card look
 * without depending on any external image CDN — so the UI never shows
 * a broken image and never depends on network access to a third party.
 */
const CATEGORY_STYLE: Record<string, { gradient: string; icon: string }> = {
  Concert: { gradient: "from-fuchsia-600 via-purple-600 to-indigo-700", icon: "🎤" },
  Sports: { gradient: "from-emerald-500 via-teal-600 to-cyan-700", icon: "🏏" },
  Movie: { gradient: "from-orange-500 via-rose-600 to-red-700", icon: "🎬" },
  Comedy: { gradient: "from-amber-400 via-orange-500 to-pink-600", icon: "😂" },
  Theatre: { gradient: "from-indigo-500 via-violet-600 to-purple-800", icon: "🎭" },
};

function daysFromNow(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

const RAW_EVENTS = [
  { title: "Arijit Live — Unplugged Tour", category: "Concert", city: "Mumbai", venue: "Jio World Garden", date: daysFromNow(4), price: 1499, seats: 40, tag: "Fast Filling" },
  { title: "Coldplay: Music of the Spheres", category: "Concert", city: "Mumbai", venue: "DY Patil Stadium", date: daysFromNow(21), price: 3499, seats: 60, tag: "Trending" },
  { title: "Prateek Kuhad — Acoustic Nights", category: "Concert", city: "Bengaluru", venue: "Phoenix Marketcity Arena", date: daysFromNow(12), price: 999, seats: 50, tag: null },
  { title: "Sunburn Festival Weekender", category: "Concert", city: "Pune", venue: "Mahalunge Grounds", date: daysFromNow(30), price: 2499, seats: 80, tag: "New" },
  { title: "AR Rahman Symphony Live", category: "Concert", city: "Chennai", venue: "YMCA Grounds", date: daysFromNow(18), price: 1999, seats: 45, tag: "Trending" },

  { title: "India vs Australia — 3rd T20I", category: "Sports", city: "Bengaluru", venue: "M. Chinnaswamy Stadium", date: daysFromNow(6), price: 799, seats: 100, tag: "Fast Filling" },
  { title: "IPL Final — Playoffs", category: "Sports", city: "Ahmedabad", venue: "Narendra Modi Stadium", date: daysFromNow(45), price: 1299, seats: 120, tag: "Trending" },
  { title: "ISL: Mumbai City vs Bengaluru FC", category: "Sports", city: "Mumbai", venue: "Mumbai Football Arena", date: daysFromNow(9), price: 499, seats: 90, tag: null },
  { title: "Pro Kabaddi League Night", category: "Sports", city: "Pune", venue: "Shree Shiv Chhatrapati Sports Complex", date: daysFromNow(14), price: 399, seats: 70, tag: "New" },

  { title: "Kalki 2 — Advance Booking", category: "Movie", city: "Delhi", venue: "PVR Select City Walk", date: daysFromNow(2), price: 349, seats: 60, tag: "Fast Filling" },
  { title: "Pathaan Returns — IMAX", category: "Movie", city: "Mumbai", venue: "INOX Nariman Point", date: daysFromNow(5), price: 449, seats: 55, tag: "Trending" },
  { title: "Interstellar — 70mm Re-release", category: "Movie", city: "Bengaluru", venue: "PVR Orion Mall", date: daysFromNow(10), price: 299, seats: 65, tag: null },
  { title: "Animal Park — Family Special", category: "Movie", city: "Hyderabad", venue: "AMB Cinemas", date: daysFromNow(7), price: 249, seats: 50, tag: null },

  { title: "Zakir Khan — Haq Se Single Tour", category: "Comedy", city: "Delhi", venue: "Siri Fort Auditorium", date: daysFromNow(11), price: 799, seats: 40, tag: "Trending" },
  { title: "Biswa Kalyan Rath — Live Set", category: "Comedy", city: "Bengaluru", venue: "Good Shepherd Auditorium", date: daysFromNow(16), price: 699, seats: 35, tag: null },
  { title: "Kenny Sebastian — New Hour", category: "Comedy", city: "Pune", venue: "Balgandharva Rang Mandir", date: daysFromNow(20), price: 599, seats: 30, tag: "New" },

  { title: "Mughal-e-Azam — The Musical", category: "Theatre", city: "Mumbai", venue: "NCPA Jamshed Bhabha Theatre", date: daysFromNow(8), price: 999, seats: 45, tag: "Trending" },
  { title: "Piya Behrupiya", category: "Theatre", city: "Delhi", venue: "Kamani Auditorium", date: daysFromNow(13), price: 599, seats: 40, tag: null },
  { title: "Hamlet — The Company Theatre", category: "Theatre", city: "Bengaluru", venue: "Ranga Shankara", date: daysFromNow(19), price: 499, seats: 35, tag: null },
];

async function seed() {
  const { rows } = await pool.query("SELECT COUNT(*)::int AS count FROM events");
  if (rows[0].count > 0) {
    console.log(`[catalog-service] seed skipped — ${rows[0].count} events already present`);
    return;
  }

  for (const e of RAW_EVENTS) {
    const style = CATEGORY_STYLE[e.category];
    const description = `Live at ${e.venue}, ${e.city}. Doors open early — arrive ahead of time as seats are allocated on a first-come basis.`;
    await pool.query(
      `INSERT INTO events (title, category, city, venue, event_date, price_from, total_seats, tag, gradient, icon, description)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
      [e.title, e.category, e.city, e.venue, e.date, e.price, e.seats, e.tag, style.gradient, style.icon, description]
    );
  }
  console.log(`[catalog-service] seeded ${RAW_EVENTS.length} events`);
}

export default seed;
