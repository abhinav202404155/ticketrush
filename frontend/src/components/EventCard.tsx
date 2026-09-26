import { EventItem } from "../lib/api";

// Defined as literal class strings (not built dynamically) so Tailwind's
// build-time scanner can see and include them in the compiled CSS.
const CATEGORY_STYLE: Record<string, { gradient: string; icon: string }> = {
  Concert: { gradient: "bg-gradient-to-br from-fuchsia-600 via-purple-600 to-indigo-700", icon: "🎤" },
  Sports: { gradient: "bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700", icon: "🏏" },
  Movie: { gradient: "bg-gradient-to-br from-orange-500 via-rose-600 to-red-700", icon: "🎬" },
  Comedy: { gradient: "bg-gradient-to-br from-amber-400 via-orange-500 to-pink-600", icon: "😂" },
  Theatre: { gradient: "bg-gradient-to-br from-indigo-500 via-violet-600 to-purple-800", icon: "🎭" },
};
const FALLBACK_STYLE = { gradient: "bg-gradient-to-br from-slate-600 to-slate-800", icon: "🎫" };

const TAG_STYLE: Record<string, string> = {
  Trending: "bg-fuchsia-500/90 text-white",
  "Fast Filling": "bg-red-500/90 text-white",
  New: "bg-emerald-500/90 text-white",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export default function EventCard({ event }: { event: EventItem }) {
  const style = CATEGORY_STYLE[event.category] ?? FALLBACK_STYLE;

  return (
    <div className="group overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-slate-900/5 transition hover:-translate-y-1 hover:shadow-xl">
      <div className={`relative flex h-36 items-center justify-center ${style.gradient}`}>
        <span className="text-5xl drop-shadow-sm transition-transform group-hover:scale-110">
          {style.icon}
        </span>
        {event.tag && (
          <span
            className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${
              TAG_STYLE[event.tag] ?? "bg-white/90 text-slate-700"
            }`}
          >
            {event.tag}
          </span>
        )}
        <span className="absolute right-3 top-3 rounded-full bg-black/30 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur">
          {event.category}
        </span>
      </div>

      <div className="p-4">
        <h3 className="font-display text-base font-bold leading-snug text-slate-900 line-clamp-2">
          {event.title}
        </h3>
        <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
          📍 {event.venue}, {event.city}
        </p>
        <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
          🗓️ {formatDate(event.event_date)}
        </p>

        <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
              Starting from
            </p>
            <p className="font-display text-lg font-extrabold text-slate-900">
              ₹{Number(event.price_from).toLocaleString("en-IN")}
            </p>
          </div>
          <button className="rounded-full bg-brand-900 px-4 py-2 text-xs font-bold text-white transition group-hover:bg-gradient-to-r group-hover:from-brand-500 group-hover:to-fuchsia-500">
            Book now
          </button>
        </div>
      </div>
    </div>
  );
}
