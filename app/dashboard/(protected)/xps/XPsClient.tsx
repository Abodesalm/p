"use client";

import { useState } from "react";
import { revalidate } from "../_components/revalidate";
import {
  Plus,
  Pencil,
  Trash2,
  Briefcase,
  BookOpen,
  ArrowRight,
  Calendar,
} from "lucide-react";
import Drawer from "../_components/Drawer";
import ConfirmDelete from "../_components/ConfirmDelete";
import {
  Field,
  Input,
  Textarea,
  Select,
  SubmitBtn,
} from "../_components/Fields";

interface XPDoc {
  _id: string;
  title: string;
  place: string;
  start: string;
  end?: string;
  desc?: string;
  type?: string;
  hidden?: boolean;
}
interface Props {
  initial: XPDoc[];
}

const EMPTY = {
  title: "",
  place: "",
  start: "",
  end: "",
  desc: "",
  type: "job",
  hidden: false,
};

function formatDate(val: string): string {
  if (!val) return "Present";
  if (val.includes("T") || /^\d{4}-\d{2}-\d{2}/.test(val)) {
    return new Date(val).toLocaleString("default", {
      month: "short",
      year: "numeric",
    });
  }
  return val;
}

export default function XPsClient({ initial }: Props) {
  const [docs, setDocs] = useState<XPDoc[]>(initial);
  const [drawer, setDrawer] = useState(false);
  const [editing, setEditing] = useState<XPDoc | null>(null);
  const [form, setForm] = useState<typeof EMPTY>(EMPTY);
  const [loading, setLoading] = useState(false);
  const [delId, setDelId] = useState<string | null>(null);
  const [delLabel, setDelLabel] = useState("");
  const [delLoading, setDelLoading] = useState(false);

  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY);
    setDrawer(true);
  };
  const openEdit = (doc: XPDoc) => {
    setEditing(doc);
    setForm({
      title: doc.title,
      place: doc.place,
      start: formatDate(doc.start),
      end: doc.end ? formatDate(doc.end) : "",
      desc: doc.desc || "",
      type: doc.type || "job",
      hidden: doc.hidden || false,
    });
    setDrawer(true);
  };
  const closeDrawer = () => {
    setDrawer(false);
    setEditing(null);
    setForm(EMPTY);
  };
  const set =
    (key: string) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editing) {
        const res = await fetch(`/api/xps/${editing._id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        setDocs((d) => d.map((x) => (x._id === editing._id ? data.data : x)));
      } else {
        const res = await fetch("/api/xps", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        setDocs((d) => [...d, data.data]);
      }
      closeDrawer();
      revalidate("xps");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!delId) return;
    setDelLoading(true);
    try {
      await fetch(`/api/xps/${delId}`, { method: "DELETE" });
      setDocs((d) => d.filter((x) => x._id !== delId));
      setDelId(null);
      revalidate("xps");
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
            Experience
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
          <Plus size={15} /> Add Experience
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
        {docs.length} item{docs.length !== 1 ? "s" : ""}
      </p>

      {/* Timeline list */}
      {docs.length === 0 ? (
        <Empty />
      ) : (
        <div style={{ position: "relative", paddingLeft: "1.5rem" }}>
          {/* Vertical line */}
          <div
            style={{
              position: "absolute",
              left: "5px",
              top: 0,
              bottom: 0,
              width: "2px",
              background:
                "linear-gradient(to bottom, #22c55e, rgba(34,197,94,0.1), transparent)",
              borderRadius: "2px",
            }}
          />

          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
          >
            {docs.map((doc) => (
              <div key={doc._id} style={{ position: "relative" }}>
                {/* Timeline dot */}
                <div
                  style={{
                    position: "absolute",
                    left: "-1.85rem",
                    top: "1.1rem",
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    background: "#22c55e",
                    boxShadow: "0 0 8px rgba(34,197,94,0.5)",
                    border: "2px solid #090b0e",
                  }}
                />

                <div
                  style={{
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
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      gap: "0.75rem",
                      flexWrap: "wrap",
                      marginBottom: "0.6rem",
                    }}
                  >
                    <div>
                      <p
                        style={{
                          fontFamily: "var(--font-body,Syne,sans-serif)",
                          fontWeight: 700,
                          fontSize: "0.92rem",
                          color: "#f8fafc",
                          margin: "0 0 3px 0",
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
                      <p
                        style={{
                          fontFamily: "var(--font-body,Syne,sans-serif)",
                          fontSize: "0.8rem",
                          color: "#22c55e",
                          fontWeight: 600,
                          margin: 0,
                        }}
                      >
                        {doc.place}
                      </p>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        flexWrap: "wrap",
                      }}
                    >
                      {/* Date badge */}
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "5px",
                          fontFamily: "var(--font-body,Syne,sans-serif)",
                          fontSize: "0.7rem",
                          fontWeight: 700,
                          padding: "3px 10px",
                          borderRadius: "999px",
                          border: "1px solid rgba(34,197,94,0.3)",
                          color: "#22c55e",
                          background: "rgba(34,197,94,0.08)",
                          whiteSpace: "nowrap",
                        }}
                      >
                        <Calendar size={10} />
                        {formatDate(doc.start)}
                        <ArrowRight size={9} style={{ opacity: 0.5 }} />
                        {doc.end ? formatDate(doc.end) : "Present"}
                      </span>
                      {/* Type badge */}
                      {doc.type && (
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                            fontFamily: "var(--font-body,Syne,sans-serif)",
                            fontSize: "0.65rem",
                            fontWeight: 700,
                            padding: "3px 8px",
                            borderRadius: "999px",
                            border: `1px solid ${doc.type === "job" ? "rgba(34,197,94,0.25)" : "rgba(99,102,241,0.25)"}`,
                            color: doc.type === "job" ? "#22c55e" : "#818cf8",
                            background:
                              doc.type === "job"
                                ? "rgba(34,197,94,0.06)"
                                : "rgba(99,102,241,0.06)",
                          }}
                        >
                          {doc.type === "job" ? (
                            <Briefcase size={9} />
                          ) : (
                            <BookOpen size={9} />
                          )}
                          {doc.type}
                        </span>
                      )}
                      {/* Action buttons */}
                      <div style={{ display: "flex", gap: "5px" }}>
                        <ActionBtn
                          onClick={() => openEdit(doc)}
                          color="rgba(248,250,252,0.5)"
                          hoverColor="#22c55e"
                          hoverBg="rgba(34,197,94,0.1)"
                        >
                          <Pencil size={12} />
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
                          <Trash2 size={12} />
                        </ActionBtn>
                      </div>
                    </div>
                  </div>
                  {doc.desc && (
                    <p
                      style={{
                        fontFamily: "var(--font-body,Syne,sans-serif)",
                        fontSize: "0.82rem",
                        color: "rgba(248,250,252,0.5)",
                        lineHeight: 1.7,
                        margin: 0,
                      }}
                    >
                      {doc.desc}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Drawer */}
      <Drawer
        open={drawer}
        onClose={closeDrawer}
        title={editing ? "Edit Experience" : "Add Experience"}
      >
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
        >
          <Field label="Title" required>
            <Input
              value={form.title}
              onChange={set("title")}
              placeholder="Front-End Developer"
            />
          </Field>
          <Field label="Place" required>
            <Input
              value={form.place}
              onChange={set("place")}
              placeholder="Company / Organization"
            />
          </Field>
          <Field label="Type">
            <Select value={form.type} onChange={set("type")}>
              <option value="job">Job</option>
              <option value="education">Education</option>
            </Select>
          </Field>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
            }}
          >
            <Field label="Start" required>
              <Input
                value={form.start}
                onChange={set("start")}
                placeholder="Nov 2022"
              />
            </Field>
            <Field label="End" hint="Leave empty for Present">
              <Input
                value={form.end}
                onChange={set("end")}
                placeholder="Present"
              />
            </Field>
          </div>
          <Field label="Description">
            <Textarea
              value={form.desc}
              onChange={set("desc")}
              placeholder="What you did, built, or achieved..."
              rows={5}
            />
          </Field>
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
      <Briefcase
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
        No experience items yet
      </p>
    </div>
  );
}

function ActionBtn({ onClick, color, hoverColor, hoverBg, children }: any) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "30px",
        height: "30px",
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
