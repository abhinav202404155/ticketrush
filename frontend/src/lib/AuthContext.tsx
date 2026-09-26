import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthAPI, UserProfile } from "./api";

interface AuthState {
  user: UserProfile | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

const STORAGE_KEY = "ticketrush.token";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      setLoading(false);
      return;
    }
    AuthAPI.me(saved)
      .then(({ user }) => {
        setUser(user);
        setToken(saved);
      })
      .catch(() => localStorage.removeItem(STORAGE_KEY))
      .finally(() => setLoading(false));
  }, []);

  async function login(email: string, password: string) {
    const { token, user } = await AuthAPI.login(email, password);
    localStorage.setItem(STORAGE_KEY, token);
    setToken(token);
    setUser(user);
  }

  async function signup(name: string, email: string, password: string) {
    const { token, user } = await AuthAPI.signup(name, email, password);
    localStorage.setItem(STORAGE_KEY, token);
    setToken(token);
    setUser(user);
  }

  function logout() {
    localStorage.removeItem(STORAGE_KEY);
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
