"use client";

import { useState } from "react";
import { revalidate } from "../_components/revalidate";
import { Plus, Pencil, Trash2, Star, ExternalLink } from "lucide-react";
import Drawer from "../_components/Drawer";
import ConfirmDelete from "../_components/ConfirmDelete";
import { Field, Input, Textarea, SubmitBtn } from "../_components/Fields";

interface ReviewDoc {
  _id: string;
  name: string;
  content: string;
  link?: string;
  hidden?: boolean;
}
interface Props {
  initial: ReviewDoc[];
}

const EMPTY = { name: "", content: "", link: "", hidden: false };

export default function ReviewsClient({ initial }: Props) {
  const [docs, setDocs] = useState<ReviewDoc[]>(initial);
  const [drawer, setDrawer] = useState(false);
  const [editing, setEditing] = useState<ReviewDoc | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [delId, setDelId] = useState<string | null>(null);
  const [delLabel, setDelLabel] = useState("");
  const [delLoading, setDelLoading] = useState(false);

  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY);
    setDrawer(true);
  };
  const openEdit = (doc: ReviewDoc) => {
    setEditing(doc);
    setForm({
      name: doc.name,
      content: doc.content,
      link: doc.link || "",
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
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editing) {
        const res = await fetch(`/api/reviews/${editing._id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        setDocs((d) => d.map((x) => (x._id === editing._id ? data.data : x)));
      } else {
        const res = await fetch("/api/reviews", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        setDocs((d) => [data.data, ...d]);
      }
      closeDrawer();
      revalidate("reviews");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!delId) return;
    setDelLoading(true);
    try {
      await fetch(`/api/reviews/${delId}`, { method: "DELETE" });
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
            Reviews
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
            transition: "background 0.15s",
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
          <Plus size={15} /> Add Review
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
        {docs.length} review{docs.length !== 1 ? "s" : ""}
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
                padding: "1.25rem 1.5rem",
                borderRadius: "14px",
                border: "1px solid rgba(255,255,255,0.07)",
                background: "rgba(255,255,255,0.02)",
                transition: "border-color 0.15s",
                position: "relative",
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
              {/* Stars */}
              <div
                style={{ display: "flex", gap: "3px", marginBottom: "0.6rem" }}
              >
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={11}
                    style={{ color: "#fbbf24", fill: "#fbbf24" }}
                  />
                ))}
              </div>

              {/* Content */}
              <p
                style={{
                  fontFamily: "var(--font-body,Syne,sans-serif)",
                  fontSize: "0.88rem",
                  color: "rgba(248,250,252,0.75)",
                  lineHeight: 1.7,
                  margin: "0 0 0.85rem 0",
                  fontStyle: "italic",
                }}
              >
                "{doc.content}"
              </p>

              {/* Footer */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "0.5rem",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      background: "rgba(34,197,94,0.1)",
                      border: "1px solid rgba(34,197,94,0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "var(--font-body,Syne,sans-serif)",
                      fontWeight: 700,
                      fontSize: "0.85rem",
                      color: "#22c55e",
                    }}
                  >
                    {doc.name[0]}
                  </div>
                  <div>
                    <p
                      style={{
                        fontFamily: "var(--font-body,Syne,sans-serif)",
                        fontWeight: 700,
                        fontSize: "0.85rem",
                        color: "#f8fafc",
                        margin: 0,
                      }}
                    >
                      {doc.name}
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
                    {doc.link && (
                      <a
                        href={doc.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          fontFamily: "var(--font-body,Syne,sans-serif)",
                          fontSize: "0.7rem",
                          color: "rgba(248,250,252,0.35)",
                          textDecoration: "none",
                          transition: "color 0.15s",
                        }}
                        onMouseEnter={(e) =>
                          ((e.currentTarget as HTMLAnchorElement).style.color =
                            "#22c55e")
                        }
                        onMouseLeave={(e) =>
                          ((e.currentTarget as HTMLAnchorElement).style.color =
                            "rgba(248,250,252,0.35)")
                        }
                      >
                        <ExternalLink size={10} />{" "}
                        {doc.link.replace(/^https?:\/\//, "").split("/")[0]}
                      </a>
                    )}
                  </div>
                </div>
                <div style={{ display: "flex", gap: "6px" }}>
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
                      setDelLabel(doc.name);
                    }}
                    color="rgba(248,250,252,0.5)"
                    hoverColor="rgb(239,68,68)"
                    hoverBg="rgba(239,68,68,0.1)"
                  >
                    <Trash2 size={13} />
                  </ActionBtn>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Drawer */}
      <Drawer
        open={drawer}
        onClose={closeDrawer}
        title={editing ? "Edit Review" : "Add Review"}
      >
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
        >
          <Field label="Name" required>
            <Input
              value={form.name}
              onChange={set("name")}
              placeholder="Ahmed A."
            />
          </Field>
          <Field label="Content" required>
            <Textarea
              value={form.content}
              onChange={set("content")}
              placeholder="Review content..."
              rows={5}
            />
          </Field>
          <Field
            label="Link"
            hint="Optional — profile link (e.g. Khamsat, LinkedIn)"
          >
            <Input
              value={form.link}
              onChange={set("link")}
              placeholder="https://..."
              type="url"
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
      <Star
        size={32}
        style={{ color: "rgba(251,191,36,0.3)", marginBottom: "1rem" }}
      />
      <p
        style={{
          fontFamily: "var(--font-body,Syne,sans-serif)",
          color: "rgba(248,250,252,0.3)",
          margin: 0,
        }}
      >
        No reviews yet
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
        transition: "background 0.15s,color 0.15s,border-color 0.15s",
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
