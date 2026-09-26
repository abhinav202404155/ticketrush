const AUTH_BASE = import.meta.env.VITE_AUTH_API_URL || "/api/auth";
const CATALOG_BASE = import.meta.env.VITE_CATALOG_API_URL || "/api/catalog";

export interface EventItem {
  id: string;
  title: string;
  category: string;
  city: string;
  venue: string;
  event_date: string;
  price_from: string;
  total_seats: number;
  tag: string | null;
  gradient: string;
  icon: string;
  description: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
}

async function handle<T>(res: Response): Promise<T> {
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body.error || `Request failed with status ${res.status}`);
  }
  return body as T;
}

export const AuthAPI = {
  signup: (name: string, email: string, password: string) =>
    fetch(`${AUTH_BASE}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    }).then((r) => handle<{ token: string; user: UserProfile }>(r)),

  login: (email: string, password: string) =>
    fetch(`${AUTH_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    }).then((r) => handle<{ token: string; user: UserProfile }>(r)),

  me: (token: string) =>
    fetch(`${AUTH_BASE}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((r) => handle<{ user: UserProfile }>(r)),
};

export const CatalogAPI = {
  filters: () =>
    fetch(`${CATALOG_BASE}/filters`).then((r) =>
      handle<{ cities: string[]; categories: string[] }>(r)
    ),

  search: (params: { city?: string; category?: string; q?: string }) => {
    const usp = new URLSearchParams();
    if (params.city) usp.set("city", params.city);
    if (params.category) usp.set("category", params.category);
    if (params.q) usp.set("q", params.q);
    return fetch(`${CATALOG_BASE}/events?${usp.toString()}`).then((r) =>
      handle<{ events: EventItem[]; count: number }>(r)
    );
  },

  get: (id: string) =>
    fetch(`${CATALOG_BASE}/events/${id}`).then((r) => handle<{ event: EventItem }>(r)),
};
