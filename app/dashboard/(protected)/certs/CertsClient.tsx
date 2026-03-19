"use client";

import { useState } from "react";
import { revalidate } from "../_components/revalidate";
import { Plus, Pencil, Trash2, Award } from "lucide-react";
import Drawer from "../_components/Drawer";
import ConfirmDelete from "../_components/ConfirmDelete";
import { Field, Input, SubmitBtn } from "../_components/Fields";

interface CertDoc {
  _id: string;
  title: string;
  score?: string;
  date?: string;
  hidden?: boolean;
}
interface Props {
  initial: CertDoc[];
}

const EMPTY = { title: "", score: "", date: "", hidden: false };

// shared fetch options — always send cookies
const fetchOpts = (method: string, body?: object) => ({
  method,
  credentials: "include" as const,
  headers: { "Content-Type": "application/json" },
  ...(body ? { body: JSON.stringify(body) } : {}),
});

export default function CertsClient({ initial }: Props) {
  const [docs, setDocs] = useState<CertDoc[]>(initial);
  const [drawer, setDrawer] = useState(false);
  const [editing, setEditing] = useState<CertDoc | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [delId, setDelId] = useState<string | null>(null);
  const [delLabel, setDelLabel] = useState("");
  const [delLoading, setDelLoading] = useState(false);

  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY);
    setError("");
    setDrawer(true);
  };
  const openEdit = (doc: CertDoc) => {
    setEditing(doc);
    setForm({
      title: doc.title,
      score: doc.score || "",
      date: doc.date || "",
      hidden: doc.hidden || false,
    });
    setError("");
    setDrawer(true);
  };
  const closeDrawer = () => {
    setDrawer(false);
    setEditing(null);
    setForm(EMPTY);
    setError("");
  };
  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (editing) {
        const res = await fetch(
          `/api/certs/${editing._id}`,
          fetchOpts("PATCH", form),
        );
        const data = await res.json();
        if (!res.ok || !data.data) {
          setError(data.message || "Update failed");
          return;
        }
        setDocs((d) => d.map((x) => (x._id === editing._id ? data.data : x)));
      } else {
        const res = await fetch("/api/certs", fetchOpts("POST", form));
        const data = await res.json();
        if (!res.ok || !data.data) {
          setError(data.message || "Create failed");
          return;
        }
        setDocs((d) => [data.data, ...d]);
      }
      closeDrawer();
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!delId) return;
    setDelLoading(true);
    try {
      await fetch(`/api/certs/${delId}`, fetchOpts("DELETE"));
      setDocs((d) => d.filter((x) => x._id !== delId));
      setDelId(null);
    } finally {
      setDelLoading(false);
    }
  };

  return (
    <div style={{ padding: "2.5rem" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "2rem",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div>
          <span
            style={{
              fontFamily: "var(--font-pixel,'Press Start 2P',monospace)",
              fontSize: "0.45rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#22c55e",
              opacity: 0.7,
            }}
          >
            Dashboard
          </span>
          <h1
            style={{
              fontFamily: "var(--font-pixel,'Press Start 2P',monospace)",
              fontSize: "clamp(0.8rem,2vw,1.1rem)",
              color: "#f8fafc",
              margin: "0.6rem 0 0 0",
              lineHeight: 1.5,
            }}
          >
            Certificates
          </h1>
        </div>
        <button
          onClick={openAdd}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "7px",
            padding: "0.6rem 1.25rem",
            borderRadius: "9px",
            border: "1.5px solid #22c55e",
            background: "#22c55e",
            color: "#090b0e",
            fontFamily: "var(--font-body,Syne,sans-serif)",
            fontWeight: 700,
            fontSize: "0.82rem",
            cursor: "pointer",
            transition: "background 0.15s, color 0.15s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background =
              "transparent";
            (e.currentTarget as HTMLButtonElement).style.color = "#22c55e";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "#22c55e";
            (e.currentTarget as HTMLButtonElement).style.color = "#090b0e";
          }}
        >
          <Plus size={15} /> Add Certificate
        </button>
      </div>

      {/* Count */}
      <p
        style={{
          fontFamily: "var(--font-pixel,'Press Start 2P',monospace)",
          fontSize: "0.38rem",
          color: "rgba(34,197,94,0.6)",
          letterSpacing: "0.1em",
          marginBottom: "1rem",
        }}
      >
        {docs.length} certificate{docs.length !== 1 ? "s" : ""}
      </p>

      {/* List */}
      {docs.length === 0 ? (
        <Empty />
      ) : (
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
        >
          {docs.map((doc) => (
            <div
              key={doc._id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                padding: "1.1rem 1.25rem",
                borderRadius: "13px",
                border: "1px solid rgba(255,255,255,0.07)",
                background: "rgba(255,255,255,0.02)",
                transition: "border-color 0.15s",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLDivElement).style.borderColor =
                  "rgba(34,197,94,0.2)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLDivElement).style.borderColor =
                  "rgba(255,255,255,0.07)")
              }
            >
              <div
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "11px",
                  background: "rgba(34,197,94,0.08)",
                  border: "1px solid rgba(34,197,94,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Award size={18} style={{ color: "#22c55e" }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    fontFamily: "var(--font-body,Syne,sans-serif)",
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    color: "#f8fafc",
                    margin: "0 0 4px 0",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {doc.title}
                </p>
                {doc.hidden && (
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      padding: "1px 7px",
                      borderRadius: "999px",
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      fontSize: "0.65rem",
                      fontWeight: 600,
                      color: "rgba(248,250,252,0.4)",
                      fontFamily: "var(--font-body,Syne,sans-serif)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    hidden
                  </span>
                )}
                <div
                  style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}
                >
                  {doc.date && (
                    <span
                      style={{
                        fontFamily:
                          "var(--font-pixel,'Press Start 2P',monospace)",
                        fontSize: "0.38rem",
                        padding: "2px 8px",
                        borderRadius: "999px",
                        border: "1px solid rgba(34,197,94,0.2)",
                        color: "rgba(34,197,94,0.75)",
                        background: "rgba(34,197,94,0.06)",
                      }}
                    >
                      {doc.date}
                    </span>
                  )}
                  {doc.score && (
                    <span
                      style={{
                        fontFamily:
                          "var(--font-pixel,'Press Start 2P',monospace)",
                        fontSize: "0.38rem",
                        padding: "2px 8px",
                        borderRadius: "999px",
                        border: "1px solid rgba(251,191,36,0.3)",
                        color: "#fbbf24",
                        background: "rgba(251,191,36,0.07)",
                      }}
                    >
                      {doc.score}
                    </span>
                  )}
                </div>
              </div>
              <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
                <ActionBtn
                  onClick={() => openEdit(doc)}
                  color="rgba(248,250,252,0.5)"
                  hoverColor="#22c55e"
                  hoverBg="rgba(34,197,94,0.1)"
                >
                  <Pencil size={13} />
                </ActionBtn>
                <ActionBtn
                  onClick={() => {
                    setDelId(doc._id);
                    setDelLabel(doc.title);
                  }}
                  color="rgba(248,250,252,0.5)"
                  hoverColor="rgb(239,68,68)"
                  hoverBg="rgba(239,68,68,0.1)"
                >
                  <Trash2 size={13} />
                </ActionBtn>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Drawer */}
      <Drawer
        open={drawer}
        onClose={closeDrawer}
        title={editing ? "Edit Certificate" : "Add Certificate"}
      >
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
        >
          <Field label="Title" required>
            <Input
              value={form.title}
              onChange={set("title")}
              placeholder="Full Stack Web Development"
            />
          </Field>
          <Field label="Date" hint="e.g. 2024 or Jun 2024">
            <Input
              value={form.date}
              onChange={set("date")}
              placeholder="2024"
            />
          </Field>
          <Field label="Score" hint="e.g. 98% or Distinction — optional">
            <Input
              value={form.score}
              onChange={set("score")}
              placeholder="98%"
            />
          </Field>
          {error && (
            <p
              style={{
                fontFamily: "var(--font-body,Syne,sans-serif)",
                fontSize: "0.8rem",
                color: "rgb(239,68,68)",
                padding: "0.6rem 0.85rem",
                borderRadius: "8px",
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.2)",
                margin: 0,
              }}
            >
              {error}
            </p>
          )}
          <Field label="Visibility">
            <div
              onClick={() => setForm((f) => ({ ...f, hidden: !f.hidden }))}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0.65rem 0.85rem",
                borderRadius: "9px",
                border: "1.5px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.04)",
                cursor: "pointer",
                transition: "border-color 0.2s",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLDivElement).style.borderColor =
                  "rgba(34,197,94,0.3)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLDivElement).style.borderColor =
                  "rgba(255,255,255,0.08)")
              }
            >
              <span
                style={{
                  fontFamily: "var(--font-body,Syne,sans-serif)",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  color: form.hidden ? "rgba(248,250,252,0.4)" : "#f8fafc",
                }}
              >
                {form.hidden ? "Hidden from public" : "Visible to public"}
              </span>
              <div
                style={{
                  width: "36px",
                  height: "20px",
                  borderRadius: "999px",
                  background: form.hidden ? "rgba(255,255,255,0.1)" : "#22c55e",
                  position: "relative",
                  transition: "background 0.2s",
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "3px",
                    left: form.hidden ? "3px" : "19px",
                    width: "14px",
                    height: "14px",
                    borderRadius: "50%",
                    background: "#fff",
                    transition: "left 0.2s",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
                  }}
                />
              </div>
            </div>
          </Field>
          <SubmitBtn loading={loading} isEdit={!!editing} />
        </form>
      </Drawer>

      <ConfirmDelete
        open={!!delId}
        label={delLabel}
        onConfirm={handleDelete}
        onCancel={() => setDelId(null)}
        loading={delLoading}
      />
    </div>
  );
}

function Empty() {
  return (
    <div style={{ textAlign: "center", padding: "4rem 0" }}>
      <Award
        size={32}
        style={{ color: "rgba(34,197,94,0.3)", marginBottom: "1rem" }}
      />
      <p
        style={{
          fontFamily: "var(--font-body,Syne,sans-serif)",
          color: "rgba(248,250,252,0.3)",
          margin: 0,
        }}
      >
        No certificates yet
      </p>
    </div>
  );
}

function ActionBtn({ onClick, color, hoverColor, hoverBg, children }: any) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "32px",
        height: "32px",
        borderRadius: "7px",
        border: "1px solid rgba(255,255,255,0.08)",
        background: "transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        color,
        transition: "background 0.15s, color 0.15s, border-color 0.15s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = hoverBg;
        (e.currentTarget as HTMLButtonElement).style.color = hoverColor;
        (e.currentTarget as HTMLButtonElement).style.borderColor =
          hoverColor + "44";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = "transparent";
        (e.currentTarget as HTMLButtonElement).style.color = color;
        (e.currentTarget as HTMLButtonElement).style.borderColor =
          "rgba(255,255,255,0.08)";
      }}
    >
      {children}
    </button>
  );
}
