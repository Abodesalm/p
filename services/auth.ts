"use server";

import { sessionOptions, SessionData, defaultSession } from "@/lib/lib";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

// ── Session ──────────────────────────────────────────────────────────────────

export const getAuth = async () => {
  const session = await getIronSession<SessionData>(
    await cookies(),
    sessionOptions,
  );
  if (!session.isLoged) {
    session.isLoged = defaultSession.isLoged;
  }
  return session;
};

export const logout = async () => {
  const session = await getAuth();
  session.destroy();
};

// ── Fetch helpers ────────────────────────────────────────────────────────────
// Auth is handled by the session cookie automatically — no Bearer token needed.
// All errors are thrown so the caller can handle them properly.

export const get = async (api: string, queries = "") => {
  const res = await fetch(`${api}${queries ? `?${queries}` : ""}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "GET failed");
  return data;
};

export const post = async (api: string, body: Record<string, any>) => {
  const res = await fetch(api, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "POST failed");
  return data;
};

export const patch = async (api: string, body: Record<string, any>) => {
  const res = await fetch(api, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body), // fixed: was JSON.stringify({ body })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "PATCH failed");
  return data;
};

export const del = async (api: string) => {
  const res = await fetch(api, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "DELETE failed");
  return data;
};
