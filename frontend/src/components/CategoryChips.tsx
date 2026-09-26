const CATEGORY_META: Record<string, string> = {
  Concert: "🎤",
  Sports: "🏏",
  Movie: "🎬",
  Comedy: "😂",
  Theatre: "🎭",
};

export default function CategoryChips({
  categories,
  active,
  onSelect,
}: {
  categories: string[];
  active: string;
  onSelect: (category: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onSelect("")}
        className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition ${
          active === ""
            ? "border-transparent bg-brand-900 text-white shadow-card"
            : "border-slate-200 bg-white text-slate-600 hover:border-brand-300 hover:text-brand-700"
        }`}
      >
        All events
      </button>
      {categories.map((c) => (
        <button
          key={c}
          onClick={() => onSelect(c)}
          className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition ${
            active === c
              ? "border-transparent bg-brand-900 text-white shadow-card"
              : "border-slate-200 bg-white text-slate-600 hover:border-brand-300 hover:text-brand-700"
          }`}
        >
          <span className="mr-1.5">{CATEGORY_META[c] ?? "🎫"}</span>
          {c}
        </button>
      ))}
    </div>
  );
}
