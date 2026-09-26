import { useState } from "react";
import { useAuth } from "../lib/AuthContext";
import AuthModal from "./AuthModal";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState<"login" | "signup">("login");

  function openAuth(m: "login" | "signup") {
    setMode(m);
    setModalOpen(true);
  }

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-white/10 bg-brand-900/90 backdrop-blur supports-[backdrop-filter]:bg-brand-900/70">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <a href="/" className="flex items-center gap-2 font-display text-xl font-bold text-white">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-400 to-fuchsia-500 text-lg shadow-glow">
              🎟️
            </span>
            Ticket<span className="text-brand-400">Rush</span>
          </a>

          <div className="hidden items-center gap-1 text-sm font-medium text-slate-300 md:flex">
            {["Concerts", "Sports", "Movies", "Comedy", "Theatre"].map((c) => (
              <a
                key={c}
                href={`#browse`}
                className="rounded-full px-3 py-1.5 transition hover:bg-white/10 hover:text-white"
              >
                {c}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="hidden text-right sm:block">
                  <p className="text-sm font-semibold text-white leading-tight">{user.name}</p>
                  <p className="text-xs text-slate-400 leading-tight">{user.email}</p>
                </div>
                <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-brand-400 to-fuchsia-500 text-sm font-bold text-white">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <button
                  onClick={logout}
                  className="rounded-full border border-white/15 px-3 py-1.5 text-sm font-medium text-slate-200 transition hover:bg-white/10"
                >
                  Log out
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => openAuth("login")}
                  className="rounded-full px-4 py-1.5 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
                >
                  Log in
                </button>
                <button
                  onClick={() => openAuth("signup")}
                  className="rounded-full bg-gradient-to-r from-brand-500 to-fuchsia-500 px-4 py-1.5 text-sm font-semibold text-white shadow-glow transition hover:brightness-110"
                >
                  Sign up
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {modalOpen && (
        <AuthModal initialMode={mode} onClose={() => setModalOpen(false)} />
      )}
    </>
  );
}
