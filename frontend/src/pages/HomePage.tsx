import { useEffect, useState } from "react";
import Hero from "../components/Hero";
import CategoryChips from "../components/CategoryChips";
import EventCard from "../components/EventCard";
import { CatalogAPI, EventItem } from "../lib/api";

export default function HomePage() {
  const [cities, setCities] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [q, setQ] = useState("");
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    CatalogAPI.filters()
      .then((f) => {
        setCities(f.cities);
        setCategories(f.categories);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(null);
    CatalogAPI.search({ q, city, category })
      .then((r) => setEvents(r.events))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [q, city, category]);

  return (
    <>
      <Hero
        cities={cities}
        onSearch={(query, selectedCity) => {
          setQ(query);
          setCity(selectedCity);
        }}
      />

      <main id="browse" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold text-slate-900">
              {q || city || category ? "Search results" : "Trending right now"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {loading ? "Loading…" : `${events.length} event${events.length === 1 ? "" : "s"} found`}
              {city && <> in <span className="font-semibold text-slate-700">{city}</span></>}
            </p>
          </div>
          <CategoryChips categories={categories} active={category} onSelect={setCategory} />
        </div>

        {error && (
          <div className="mt-8 rounded-xl bg-red-50 p-4 text-sm font-medium text-red-600">
            Couldn't reach the catalog service: {error}
          </div>
        )}

        {loading ? (
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-64 animate-pulse rounded-2xl bg-slate-200/70" />
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="mt-16 text-center">
            <p className="text-4xl">🔍</p>
            <p className="mt-3 font-display text-lg font-semibold text-slate-700">
              No events match your search
            </p>
            <p className="mt-1 text-sm text-slate-500">Try a different city, category or keyword.</p>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
