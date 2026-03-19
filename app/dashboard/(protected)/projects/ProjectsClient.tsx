"use client";

import { useState, useRef } from "react";
import { revalidate } from "../_components/revalidate";
import {
  Plus,
  Pencil,
  Trash2,
  FolderOpen,
  GripVertical,
  X,
  Upload,
  Loader2,
  Image as ImageIcon,
  Film,
} from "lucide-react";
import Drawer from "../_components/Drawer";
import ConfirmDelete from "../_components/ConfirmDelete";
import { Field, Input, Textarea, SubmitBtn } from "../_components/Fields";
import ImageUpload from "../_components/ImageUpload";

interface Action {
  label: string;
  url: string;
}
interface ProjectDoc {
  _id: string;
  title: string;
  desc?: string;
  tags?: string[];
  date?: string;
  type?: string;
  cover?: string;
  media?: string[];
  action1?: Action | null;
  action2?: Action | null;
  hidden?: boolean;
}
interface Props {
  initial: ProjectDoc[];
}

const EMPTY = {
  title: "",
  desc: "",
  tags: "",
  date: "",
  type: "",
  cover: "",
  media: [] as string[],
  action1: { label: "", url: "" },
  action2: { label: "", url: "" },
  hidden: false,
};

const fetchOpts = (method: string, body?: object) => ({
  method,
  credentials: "include" as const,
  headers: { "Content-Type": "application/json" },
  ...(body ? { body: JSON.stringify(body) } : {}),
});

// ── Media upload + drag-drop ──────────────────────────────────────────────────
function MediaBox({
  media,
  setMedia,
}: {
  media: string[];
  setMedia: (m: string[]) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [overIdx, setOverIdx] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFile = async (file: File) => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;
    const isVideo = file.type.startsWith("video/");
    const endpoint = isVideo ? "video" : "image";

    const fd = new FormData();
    fd.append("file", file);
    fd.append("upload_preset", uploadPreset);
    fd.append("folder", "portfolio/projects");

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/${endpoint}/upload`,
      { method: "POST", body: fd },
    );
    const data = await res.json();
    if (!res.ok || !data.secure_url)
      throw new Error(data.error?.message || "Upload failed");
    return data.secure_url as string;
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const urls = await Promise.all(Array.from(files).map(uploadFile));
      setMedia([...media, ...urls]);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setUploading(false);
    }
  };

  // Drag-and-drop reorder
  const onDragStart = (i: number) => setDragIdx(i);
  const onDragEnter = (i: number) => setOverIdx(i);
  const onDragEnd = () => {
    if (dragIdx !== null && overIdx !== null && dragIdx !== overIdx) {
      const arr = [...media];
      const [item] = arr.splice(dragIdx, 1);
      arr.splice(overIdx, 0, item);
      setMedia(arr);
    }
    setDragIdx(null);
    setOverIdx(null);
  };

  const remove = (i: number) => setMedia(media.filter((_, idx) => idx !== i));

  const isVideo = (url: string) =>
    /\.(mp4|webm|ogg|mov)(\?|$)/i.test(url) || url.includes("/video/");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      {/* Upload zone */}
      <div
        onClick={() => !uploading && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFiles(e.dataTransfer.files);
        }}
        style={{
          padding: "1rem",
          borderRadius: "10px",
          border: `2px dashed ${dragOver ? "#22c55e" : "rgba(255,255,255,0.1)"}`,
          background: dragOver
            ? "rgba(34,197,94,0.05)"
            : "rgba(255,255,255,0.02)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.6rem",
          cursor: uploading ? "not-allowed" : "pointer",
          transition: "border-color 0.2s, background 0.2s",
        }}
        onMouseEnter={(e) => {
          if (!uploading)
            (e.currentTarget as HTMLDivElement).style.borderColor =
              "rgba(34,197,94,0.4)";
        }}
        onMouseLeave={(e) => {
          if (!dragOver)
            (e.currentTarget as HTMLDivElement).style.borderColor =
              "rgba(255,255,255,0.1)";
        }}
      >
        {uploading ? (
          <>
            <Loader2
              size={16}
              style={{
                color: "#22c55e",
                animation: "spin 0.7s linear infinite",
              }}
            />
            <span
              style={{
                fontFamily: "var(--font-body,Syne,sans-serif)",
                fontSize: "0.8rem",
                color: "rgba(248,250,252,0.5)",
              }}
            >
              Uploading...
            </span>
          </>
        ) : (
          <>
            <Upload size={15} style={{ color: "#22c55e", opacity: 0.6 }} />
            <span
              style={{
                fontFamily: "var(--font-body,Syne,sans-serif)",
                fontSize: "0.8rem",
                color: "rgba(248,250,252,0.45)",
              }}
            >
              Click or drop images / videos
            </span>
          </>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*,video/*"
        multiple
        style={{ display: "none" }}
        onChange={(e) => handleFiles(e.target.files)}
      />

      {/* Media grid */}
      {media.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "0.5rem",
          }}
        >
          {media.map((url, i) => (
            <div
              key={url + i}
              draggable
              onDragStart={() => onDragStart(i)}
              onDragEnter={() => onDragEnter(i)}
              onDragEnd={onDragEnd}
              onDragOver={(e) => e.preventDefault()}
              style={{
                position: "relative",
                borderRadius: "8px",
                overflow: "hidden",
                border: `2px solid ${overIdx === i && dragIdx !== i ? "#22c55e" : "rgba(255,255,255,0.08)"}`,
                cursor: "grab",
                transition: "border-color 0.15s",
                opacity: dragIdx === i ? 0.4 : 1,
              }}
            >
              {isVideo(url) ? (
                <div
                  style={{
                    width: "100%",
                    aspectRatio: "16/9",
                    background: "rgba(255,255,255,0.06)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Film size={20} style={{ color: "#22c55e", opacity: 0.6 }} />
                </div>
              ) : (
                <img
                  src={url}
                  alt=""
                  style={{
                    width: "100%",
                    aspectRatio: "16/9",
                    objectFit: "cover",
                    display: "block",
                    pointerEvents: "none",
                  }}
                />
              )}
              {/* Order badge */}
              <div
                style={{
                  position: "absolute",
                  top: "4px",
                  left: "4px",
                  width: "18px",
                  height: "18px",
                  borderRadius: "5px",
                  background: "rgba(0,0,0,0.7)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.6rem",
                  fontWeight: 700,
                  color: "#22c55e",
                  fontFamily: "var(--font-pixel,'Press Start 2P',monospace)",
                }}
              >
                {i + 1}
              </div>
              {/* Drag handle */}
              <div
                style={{
                  position: "absolute",
                  top: "4px",
                  right: "22px",
                  color: "rgba(255,255,255,0.5)",
                }}
              >
                <GripVertical size={12} />
              </div>
              {/* Remove */}
              <button
                onClick={() => remove(i)}
                style={{
                  position: "absolute",
                  top: "2px",
                  right: "2px",
                  width: "18px",
                  height: "18px",
                  borderRadius: "4px",
                  border: "none",
                  background: "rgba(239,68,68,0.8)",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                <X size={10} />
              </button>
            </div>
          ))}
        </div>
      )}
      {media.length > 0 && (
        <p
          style={{
            fontFamily: "var(--font-body,Syne,sans-serif)",
            fontSize: "0.7rem",
            color: "rgba(248,250,252,0.3)",
            margin: 0,
          }}
        >
          Drag items to reorder — order shown on the project page
        </p>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function ProjectsClient({ initial }: Props) {
  const [docs, setDocs] = useState<ProjectDoc[]>(initial);
  const [drawer, setDrawer] = useState(false);
  const [editing, setEditing] = useState<ProjectDoc | null>(null);
  const [form, setForm] = useState<typeof EMPTY>(EMPTY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [delId, setDelId] = useState<string | null>(null);
  const [delLabel, setDelLabel] = useState("");
  const [delLoading, setDelLoading] = useState(false);

  const openAdd = () => {
    setEditing(null);
    setError("");
    setForm(EMPTY);
    setDrawer(true);
  };
  const openEdit = (doc: ProjectDoc) => {
    setEditing(doc);
    setError("");
    setForm({
      title: doc.title,
      desc: doc.desc || "",
      tags: (doc.tags || []).join(", "),
      date: doc.date || "",
      type: doc.type || "",
      cover: doc.cover || "",
      media: doc.media || [],
      action1: doc.action1
        ? { label: doc.action1.label || "", url: doc.action1.url || "" }
        : { label: "", url: "" },
      action2: doc.action2
        ? { label: doc.action2.label || "", url: doc.action2.url || "" }
        : { label: "", url: "" },
      hidden: doc.hidden || false,
    });
    setDrawer(true);
  };
  const closeDrawer = () => {
    setDrawer(false);
    setEditing(null);
    setForm(EMPTY);
    setError("");
  };

  const set =
    (key: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const setAction =
    (n: 1 | 2, key: "label" | "url") =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({
        ...f,
        [`action${n}`]: { ...f[`action${n}`], [key]: e.target.value },
      }));

  const buildPayload = () => ({
    ...form,
    tags: form.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    action1: form.action1.label || form.action1.url ? form.action1 : null,
    action2: form.action2.label || form.action2.url ? form.action2 : null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError("Title is required.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      if (editing) {
        const res = await fetch(
          `/api/projects/${editing._id}`,
          fetchOpts("PATCH", buildPayload()),
        );
        const data = await res.json();
        if (!res.ok || !data.data) {
          setError(data.message || "Update failed");
          return;
        }
        setDocs((d) => d.map((x) => (x._id === editing._id ? data.data : x)));
      } else {
        const res = await fetch(
          "/api/projects",
          fetchOpts("POST", buildPayload()),
        );
        const data = await res.json();
        if (!res.ok || !data.data) {
          setError(data.message || "Create failed");
          return;
        }
        setDocs((d) => [data.data, ...d]);
      }
      closeDrawer();
      revalidate("projects");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!delId) return;
    setDelLoading(true);
    try {
      await fetch(`/api/projects/${delId}`, fetchOpts("DELETE"));
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
            Projects
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
          <Plus size={15} /> Add Project
        </button>
      </div>

      <p
        style={{
          fontFamily: "var(--font-pixel,'Press Start 2P',monospace)",
          fontSize: "0.38rem",
          color: "rgba(34,197,94,0.6)",
          letterSpacing: "0.1em",
          marginBottom: "1.25rem",
        }}
      >
        {docs.length} project{docs.length !== 1 ? "s" : ""}
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
                padding: "1rem 1.25rem",
                borderRadius: "13px",
                border: `1px solid ${doc.hidden ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.07)"}`,
                background: doc.hidden
                  ? "rgba(255,255,255,0.01)"
                  : "rgba(255,255,255,0.02)",
                opacity: doc.hidden ? 0.6 : 1,
                transition: "border-color 0.15s",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLDivElement).style.borderColor =
                  "rgba(34,197,94,0.2)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLDivElement).style.borderColor =
                  doc.hidden
                    ? "rgba(255,255,255,0.04)"
                    : "rgba(255,255,255,0.07)")
              }
            >
              {/* Cover thumb */}
              <div
                style={{
                  width: "56px",
                  height: "36px",
                  borderRadius: "7px",
                  overflow: "hidden",
                  flexShrink: 0,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                {doc.cover ? (
                  <img
                    src={doc.cover}
                    alt={doc.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <ImageIcon
                      size={14}
                      style={{ color: "rgba(255,255,255,0.2)" }}
                    />
                  </div>
                )}
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    flexWrap: "wrap",
                    marginBottom: "3px",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "var(--font-body,Syne,sans-serif)",
                      fontWeight: 700,
                      fontSize: "0.9rem",
                      color: "#f8fafc",
                      margin: 0,
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
                </div>
                <div
                  style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}
                >
                  {doc.type && (
                    <span
                      style={{
                        fontFamily: "var(--font-body,Syne,sans-serif)",
                        fontSize: "0.72rem",
                        color: "rgba(248,250,252,0.4)",
                      }}
                    >
                      {doc.type}
                    </span>
                  )}
                  {doc.date && (
                    <span
                      style={{
                        fontFamily: "var(--font-body,Syne,sans-serif)",
                        fontSize: "0.72rem",
                        color: "rgba(248,250,252,0.3)",
                      }}
                    >
                      {doc.date}
                    </span>
                  )}
                  {doc.media && doc.media.length > 0 && (
                    <span
                      style={{
                        fontFamily: "var(--font-body,Syne,sans-serif)",
                        fontSize: "0.72rem",
                        color: "rgba(34,197,94,0.6)",
                      }}
                    >
                      {doc.media.length} media
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
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
        title={editing ? "Edit Project" : "Add Project"}
      >
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
        >
          <Field label="Title" required>
            <Input
              value={form.title}
              onChange={set("title")}
              placeholder="Project name"
            />
          </Field>

          <Field label="Description">
            <Textarea
              value={form.desc}
              onChange={set("desc")}
              placeholder="What is this project about..."
              rows={3}
            />
          </Field>

          <Field
            label="Tags"
            hint="Separate with commas: React, TypeScript, MongoDB"
          >
            <Textarea
              value={form.tags}
              onChange={set("tags")}
              placeholder="React, NextJS, TailwindCSS"
              rows={2}
            />
          </Field>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
            }}
          >
            <Field label="Date">
              <Input
                value={form.date}
                onChange={set("date")}
                placeholder="2024-06"
              />
            </Field>
            <Field label="Type">
              <Input
                value={form.type}
                onChange={set("type")}
                placeholder="web / mobile / design"
              />
            </Field>
          </div>

          {/* Cover */}
          <ImageUpload
            value={form.cover}
            onChange={(url) => setForm((f) => ({ ...f, cover: url }))}
            label="Cover Image"
          />

          {/* Media */}
          <Field
            label="Media"
            hint="Images and videos shown on the project page in this order"
          >
            <MediaBox
              media={form.media}
              setMedia={(m) => setForm((f) => ({ ...f, media: m }))}
            />
          </Field>

          {/* Actions */}
          <div
            style={{
              padding: "1rem",
              borderRadius: "10px",
              border: "1px solid rgba(255,255,255,0.07)",
              background: "rgba(255,255,255,0.02)",
              display: "flex",
              flexDirection: "column",
              gap: "0.85rem",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-body,Syne,sans-serif)",
                fontSize: "0.75rem",
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "rgba(248,250,252,0.4)",
              }}
            >
              Action Buttons
            </span>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "0.6rem",
              }}
            >
              <Input
                value={form.action1.label}
                onChange={setAction(1, "label")}
                placeholder="Label (e.g. Live)"
              />
              <Input
                value={form.action1.url}
                onChange={setAction(1, "url")}
                placeholder="URL"
              />
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "0.6rem",
              }}
            >
              <Input
                value={form.action2.label}
                onChange={setAction(2, "label")}
                placeholder="Label (e.g. GitHub)"
              />
              <Input
                value={form.action2.url}
                onChange={setAction(2, "url")}
                placeholder="URL"
              />
            </div>
          </div>

          {/* Hidden toggle */}
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
      <FolderOpen
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
        No projects yet
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
