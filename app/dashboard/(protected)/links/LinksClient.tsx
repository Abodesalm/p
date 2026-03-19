"use client";

import { useState } from "react";
import { revalidate } from "../_components/revalidate";
import { Plus, Pencil, Trash2, Link2 } from "lucide-react";
import Drawer from "../_components/Drawer";
import ConfirmDelete from "../_components/ConfirmDelete";
import { Field, Input, SubmitBtn } from "../_components/Fields";
import Icon from "@/components/layout/Icon";
import { useRouter } from "next/navigation";

interface LinkDoc {
  _id: string;
  title: string;
  url: string;
  icon: string;
  hidden?: boolean;
}
interface Props {
  initial: LinkDoc[];
}

const EMPTY = { title: "", url: "", icon: "", hidden: false };

export default function LinksClient({ initial }: Props) {
  const router = useRouter();
  const [docs, setDocs] = useState<LinkDoc[]>(initial);
  const [drawer, setDrawer] = useState(false);
  const [editing, setEditing] = useState<LinkDoc | null>(null);
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
  const openEdit = (doc: LinkDoc) => {
    setEditing(doc);
    setForm({
      title: doc.title,
      url: doc.url,
      icon: doc.icon,
      hidden: doc.hidden || false,
    });
    setDrawer(true);
  };
  const closeDrawer = () => {
    setDrawer(false);
    setEditing(null);
    setForm(EMPTY);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editing) {
        const res = await fetch(`/api/links/${editing._id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        setDocs((d) => d.map((x) => (x._id === editing._id ? data.data : x)));
      } else {
        const res = await fetch("/api/links", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        setDocs((d) => [data.data, ...d]);
      }
      closeDrawer();
      revalidate("links");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!delId) return;
    setDelLoading(true);
    try {
      await fetch(`/api/links/${delId}`, { method: "DELETE" });
      setDocs((d) => d.filter((x) => x._id !== delId));
      setDelId(null);
      revalidate("links");
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
            Links
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
          <Plus size={15} /> Add Link
        </button>
      </div>

      {/* List */}
      {docs.length === 0 ? (
        <Empty label="No links yet" />
      ) : (
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}
        >
          {docs.map((doc) => (
            <div
              key={doc._id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                padding: "1rem 1.25rem",
                borderRadius: "12px",
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
                  width: "38px",
                  height: "38px",
                  borderRadius: "9px",
                  background: "rgba(34,197,94,0.08)",
                  border: "1px solid rgba(34,197,94,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1rem",
                  color: "#22c55e",
                  flexShrink: 0,
                }}
              >
                <Icon i={doc.icon} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    fontFamily: "var(--font-body,Syne,sans-serif)",
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    color: "#f8fafc",
                    margin: "0 0 2px 0",
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
                <a
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontFamily: "var(--font-body,Syne,sans-serif)",
                    fontSize: "0.75rem",
                    color: "rgba(248,250,252,0.4)",
                    textDecoration: "none",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "block",
                  }}
                >
                  {doc.url}
                </a>
              </div>
              <span
                style={{
                  fontFamily: "var(--font-pixel,'Press Start 2P',monospace)",
                  fontSize: "0.38rem",
                  color: "rgba(248,250,252,0.3)",
                  flexShrink: 0,
                }}
              >
                {doc.icon}
              </span>
              <RowActions
                onEdit={() => openEdit(doc)}
                onDelete={() => {
                  setDelId(doc._id);
                  setDelLabel(doc.title);
                }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Drawer */}
      <Drawer
        open={drawer}
        onClose={closeDrawer}
        title={editing ? "Edit Link" : "Add Link"}
      >
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
        >
          <Field label="Title" required>
            <Input
              value={form.title}
              onChange={(e) =>
                setForm((f) => ({ ...f, title: e.target.value }))
              }
              placeholder="GitHub"
            />
          </Field>
          <Field label="URL" required>
            <Input
              value={form.url}
              onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
              placeholder="https://github.com/..."
              type="url"
            />
          </Field>
          <Field
            label="Icon key"
            hint="e.g. github, twitter, linkedin — must match Icon.tsx"
          >
            <Input
              value={form.icon}
              onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))}
              placeholder="github"
            />
          </Field>
          {form.icon && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "0.75rem 1rem",
                borderRadius: "9px",
                background: "rgba(34,197,94,0.06)",
                border: "1px solid rgba(34,197,94,0.15)",
              }}
            >
              <span style={{ fontSize: "1.3rem", color: "#22c55e" }}>
                <Icon i={form.icon} />
              </span>
              <span
                style={{
                  fontFamily: "var(--font-body,Syne,sans-serif)",
                  fontSize: "0.8rem",
                  color: "rgba(248,250,252,0.5)",
                }}
              >
                Icon preview
              </span>
            </div>
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

function Empty({ label }: { label: string }) {
  return (
    <div style={{ textAlign: "center", padding: "4rem 0" }}>
      <Link2
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
        {label}
      </p>
    </div>
  );
}

function RowActions({
  onEdit,
  onDelete,
}: {
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
      <ActionBtn
        onClick={onEdit}
        color="rgba(248,250,252,0.5)"
        hoverColor="#22c55e"
        hoverBg="rgba(34,197,94,0.1)"
      >
        <Pencil size={13} />
      </ActionBtn>
      <ActionBtn
        onClick={onDelete}
        color="rgba(248,250,252,0.5)"
        hoverColor="rgb(239,68,68)"
        hoverBg="rgba(239,68,68,0.1)"
      >
        <Trash2 size={13} />
      </ActionBtn>
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
