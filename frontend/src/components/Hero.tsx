import { FormEvent, useState } from "react";

export default function Hero({
  cities,
  onSearch,
}: {
  cities: string[];
  onSearch: (q: string, city: string) => void;
}) {
  const [q, setQ] = useState("");
  const [city, setCity] = useState("");

  function submit(e: FormEvent) {
    e.preventDefault();
    onSearch(q, city);
    document.getElementById("browse")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section className="relative overflow-hidden bg-brand-900 bg-noise">
      <div className="pointer-events-none absolute -top-32 left-1/2 h-96 w-[42rem] -translate-x-1/2 rounded-full bg-gradient-to-br from-brand-500/40 via-fuchsia-500/30 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-gradient-to-br from-emerald-400/20 to-transparent blur-3xl" />

      <div className="relative mx-auto max-w-5xl px-4 py-20 text-center sm:px-6 sm:py-28 lg:px-8">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium text-slate-300">
          ⚡ Built to survive Tatkal-style traffic spikes
        </span>
        <h1 className="mt-6 font-display text-4xl font-extrabold leading-[1.1] text-white sm:text-6xl">
          Book your next
          <span className="text-gradient"> unforgettable </span>
          moment
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base text-slate-300 sm:text-lg">
          Concerts, cricket, movies, comedy and theatre — across India. Grab your
          seat before the rush gets it first.
        </p>

        <form
          onSubmit={submit}
          className="mx-auto mt-9 flex max-w-2xl flex-col gap-2 rounded-2xl bg-white/95 p-2 shadow-card ring-1 ring-white/20 sm:flex-row sm:rounded-full"
        >
          <div className="flex flex-1 items-center gap-2 px-3 py-2">
            <span className="text-slate-400">🔎</span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search events, artists, venues…"
              className="w-full bg-transparent text-sm text-slate-800 placeholder:text-slate-400 outline-none"
            />
          </div>
          <div className="hidden h-6 w-px self-center bg-slate-200 sm:block" />
          <div className="flex items-center gap-2 px-3 py-2 sm:w-48">
            <span className="text-slate-400">📍</span>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full bg-transparent text-sm text-slate-700 outline-none"
            >
              <option value="">All cities</option>
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="rounded-full bg-gradient-to-r from-brand-500 to-fuchsia-500 px-6 py-2.5 text-sm font-semibold text-white shadow-glow transition hover:brightness-110"
          >
            Search
          </button>
        </form>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-xs font-medium text-slate-400">
          <span>🔒 Seats locked the instant you pick them</span>
          <span>⚙️ Auto-scales under real load</span>
          <span>✅ Zero double-booking, guaranteed</span>
        </div>
      </div>
    </section>
  );
}
