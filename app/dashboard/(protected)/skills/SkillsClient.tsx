"use client";

import { useState } from "react";
import { revalidate } from "../_components/revalidate";
import { Plus, Pencil, Trash2, Cpu } from "lucide-react";
import Drawer from "../_components/Drawer";
import ConfirmDelete from "../_components/ConfirmDelete";
import { Field, Input, Select, SubmitBtn } from "../_components/Fields";
import Icon from "@/components/layout/Icon";

interface SkillDoc {
  _id: string;
  title: string;
  icon: string;
  section: string;
  level?: string;
  color: string;
  hidden?: boolean;
}
interface Props {
  initial: SkillDoc[];
}

const SECTIONS = ["web", "mobile", "graphic", "general", "lang"];
const SECTION_ORDER: Record<string, number> = {
  web: 0,
  mobile: 1,
  graphic: 2,
  general: 3,
  lang: 4,
};
const EMPTY = {
  title: "",
  icon: "",
  section: "web",
  level: "",
  color: "#22c55e",
  hidden: false,
};

const SECTION_COLORS: Record<string, string> = {
  web: "#38bdf8",
  mobile: "#7f52ff",
  graphic: "#f5792a",
  general: "#22c55e",
  lang: "#fbbf24",
};

export default function SkillsClient({ initial }: Props) {
  const [docs, setDocs] = useState<SkillDoc[]>(
    [...initial].sort(
      (a, b) =>
        (SECTION_ORDER[a.section] ?? 99) - (SECTION_ORDER[b.section] ?? 99),
    ),
  );
  const [drawer, setDrawer] = useState(false);
  const [editing, setEditing] = useState<SkillDoc | null>(null);
  const [form, setForm] = useState<typeof EMPTY>(EMPTY);
  const [loading, setLoading] = useState(false);
  const [delId, setDelId] = useState<string | null>(null);
  const [delLabel, setDelLabel] = useState("");
  const [delLoading, setDelLoading] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("all");

  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY);
    setDrawer(true);
  };
  const openEdit = (doc: SkillDoc) => {
    setEditing(doc);
    setForm({
      title: doc.title,
      icon: doc.icon,
      section: doc.section,
      level: doc.level || "",
      color: doc.color,
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
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editing) {
        const res = await fetch(`/api/skills/${editing._id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        setDocs((d) =>
          d
            .map((x) => (x._id === editing._id ? data.data : x))
            .sort(
              (a, b) =>
                (SECTION_ORDER[a.section] ?? 99) -
                (SECTION_ORDER[b.section] ?? 99),
            ),
        );
      } else {
        const res = await fetch("/api/skills", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        setDocs((d) =>
          [...d, data.data].sort(
            (a, b) =>
              (SECTION_ORDER[a.section] ?? 99) -
              (SECTION_ORDER[b.section] ?? 99),
          ),
        );
      }
      closeDrawer();
      revalidate("skills");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!delId) return;
    setDelLoading(true);
    try {
      await fetch(`/api/skills/${delId}`, { method: "DELETE" });
      setDocs((d) => d.filter((x) => x._id !== delId));
      setDelId(null);
    } finally {
      setDelLoading(false);
    }
  };

  const filtered =
    activeSection === "all"
      ? docs
      : docs.filter((d) => d.section === activeSection);

  return (
    <div style={{ padding: "2.5rem" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "1.5rem",
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
            Skills
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
          <Plus size={15} /> Add Skill
        </button>
      </div>

      {/* Section filter tabs */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.5rem",
          marginBottom: "1.5rem",
        }}
      >
        {["all", ...SECTIONS].map((s) => (
          <button
            key={s}
            onClick={() => setActiveSection(s)}
            style={{
              padding: "0.3rem 0.85rem",
              borderRadius: "999px",
              border: "1.5px solid",
              fontFamily: "var(--font-body,Syne,sans-serif)",
              fontSize: "0.72rem",
              fontWeight: 700,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "all 0.15s",
              background:
                activeSection === s
                  ? SECTION_COLORS[s] || "#22c55e"
                  : "transparent",
              borderColor:
                activeSection === s
                  ? SECTION_COLORS[s] || "#22c55e"
                  : "rgba(255,255,255,0.1)",
              color: activeSection === s ? "#090b0e" : "rgba(248,250,252,0.45)",
            }}
          >
            {s}
          </button>
        ))}
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
        {filtered.length} skill{filtered.length !== 1 ? "s" : ""}
      </p>

      {/* Grid */}
      {filtered.length === 0 ? (
        <Empty />
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))",
            gap: "0.75rem",
          }}
        >
          {filtered.map((doc) => (
            <div
              key={doc._id}
              style={{
                padding: "1rem",
                borderRadius: "12px",
                border: "1px solid rgba(255,255,255,0.07)",
                background: "rgba(255,255,255,0.02)",
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
                transition: "border-color 0.15s",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLDivElement).style.borderColor =
                  `${doc.color}44`)
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLDivElement).style.borderColor =
                  "rgba(255,255,255,0.07)")
              }
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ fontSize: "1.5rem", color: doc.color }}>
                  <Icon i={doc.icon} />
                </span>
                <span
                  style={{
                    padding: "2px 8px",
                    borderRadius: "999px",
                    fontSize: "0.6rem",
                    fontFamily: "var(--font-body,Syne,sans-serif)",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    background: `${SECTION_COLORS[doc.section] || "#22c55e"}15`,
                    color: SECTION_COLORS[doc.section] || "#22c55e",
                    border: `1px solid ${SECTION_COLORS[doc.section] || "#22c55e"}33`,
                  }}
                >
                  {doc.section}
                </span>
              </div>
              <div>
                <p
                  style={{
                    fontFamily: "var(--font-body,Syne,sans-serif)",
                    fontWeight: 700,
                    fontSize: "0.88rem",
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
                {doc.level && (
                  <p
                    style={{
                      fontFamily:
                        "var(--font-pixel,'Press Start 2P',monospace)",
                      fontSize: "0.38rem",
                      color: "rgba(248,250,252,0.4)",
                      margin: 0,
                    }}
                  >
                    {doc.level}
                  </p>
                )}
              </div>
              <div style={{ display: "flex", gap: "6px", marginTop: "auto" }}>
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
          ))}
        </div>
      )}

      {/* Drawer */}
      <Drawer
        open={drawer}
        onClose={closeDrawer}
        title={editing ? "Edit Skill" : "Add Skill"}
      >
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
        >
          <Field label="Title" required>
            <Input
              value={form.title}
              onChange={set("title")}
              placeholder="React"
            />
          </Field>
          <Field label="Section" required>
            <Select value={form.section} onChange={set("section")}>
              {SECTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Select>
          </Field>
          <Field
            label="Icon key"
            hint="e.g. reactjs, python, git — must match Icon.tsx"
          >
            <Input
              value={form.icon}
              onChange={set("icon")}
              placeholder="reactjs"
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
              <span
                style={{ fontSize: "1.5rem", color: form.color || "#22c55e" }}
              >
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
          <Field label="Color" hint="Hex color for the icon">
            <Input
              value={form.color}
              onChange={set("color")}
              placeholder="#22c55e"
              type="color"
              style={{ height: "44px", padding: "4px 8px", cursor: "pointer" }}
            />
          </Field>
          <Field
            label="Level"
            hint="Optional — e.g. Native, Fluent, Good (mainly for languages)"
          >
            <Input
              value={form.level}
              onChange={set("level")}
              placeholder="Fluent"
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
      <Cpu
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
        No skills yet
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
