"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, EyeOff, Save, Loader2 } from "lucide-react";
import { revalidate } from "../_components/revalidate";
import { Field, Input } from "../_components/Fields";
import ImageUpload from "../_components/ImageUpload";

// ── Custom markdown renderer ─────────────────────────────────────────────────
// Supports: ::g[text] green, ::d[text] red, ::p[text] purple, [link](url)
function parseCustomMarkdown(text: string): string {
  return text
    .replace(/::g\[([^\]]+)\]/g, '<span class="md-green">$1</span>')
    .replace(/::d\[([^\]]+)\]/g, '<span class="md-red">$1</span>')
    .replace(/::p\[([^\]]+)\]/g, '<span class="md-purple">$1</span>');
}

function MarkdownPreview({ content }: { content: string }) {
  const processed = parseCustomMarkdown(content);
  return (
    <div
      className="article-preview"
      dir="auto"
      dangerouslySetInnerHTML={{ __html: require("marked").parse(processed) }}
    />
  );
}

// Read time estimate (avg 200 wpm for Arabic)
function calcReadTime(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

interface ArticleDoc {
  _id?: string;
  title?: string;
  author?: string;
  cover?: string;
  content?: string;
  hidden?: boolean;
}

interface Props {
  initial?: ArticleDoc;
  isNew?: boolean;
}

const fetchOpts = (method: string, body?: object) => ({
  method,
  credentials: "include" as const,
  headers: { "Content-Type": "application/json" },
  ...(body ? { body: JSON.stringify(body) } : {}),
});

export default function ArticleEditor({ initial, isNew = false }: Props) {
  const router = useRouter();
  const [form, setForm] = useState({
    title: initial?.title ?? "",
    author: initial?.author ?? "",
    cover: initial?.cover ?? "",
    content: initial?.content ?? "",
    hidden: initial?.hidden ?? false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [preview, setPreview] = useState(true);

  const readTime = calcReadTime(form.content);
  const set =
    (key: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError("Title is required.");
      return;
    }
    if (!form.content.trim()) {
      setError("Content is required.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const payload = {
        ...form,
        readTime,
        ...(isNew ? { date: new Date() } : {}),
      };
      const res = isNew
        ? await fetch("/api/articles", fetchOpts("POST", payload))
        : await fetch(
            `/api/articles/${initial?._id}`,
            fetchOpts("PATCH", payload),
          );
      const data = await res.json();
      if (!res.ok || !data.data) {
        setError(data.message || "Save failed.");
        return;
      }
      setSaved(true);
      revalidate("articles");
      setTimeout(() => {
        router.push("/dashboard/articles");
      }, 800);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Arabic:wght@300;400;500;600;700&display=swap');

        .article-preview {
          font-family: 'IBM Plex Arabic', 'Syne', sans-serif;
          font-size: 1rem;
          line-height: 2;
          color: rgba(248,250,252,0.85);
          direction: rtl;
          text-align: right;
        }
        .article-preview h1 { font-size: 1.6rem; font-weight: 700; color: #f8fafc; margin: 1.5rem 0 0.75rem; }
        .article-preview h2 { font-size: 1.3rem; font-weight: 700; color: #f8fafc; margin: 1.25rem 0 0.6rem; }
        .article-preview h3 { font-size: 1.1rem; font-weight: 700; color: #f8fafc; margin: 1rem 0 0.5rem; }
        .article-preview p  { margin: 0.6rem 0; }
        .article-preview a  { color: #22c55e; text-decoration: underline; text-decoration-color: rgba(34,197,94,0.4); }
        .article-preview a:hover { text-decoration-color: #22c55e; }
        .article-preview strong { color: #f8fafc; font-weight: 700; }
        .article-preview em { font-style: italic; color: rgba(248,250,252,0.7); }
        .article-preview code { font-family: monospace; background: rgba(255,255,255,0.08); padding: 1px 6px; border-radius: 4px; font-size: 0.88em; color: #22c55e; }
        .article-preview pre  { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 1rem; overflow-x: auto; margin: 1rem 0; }
        .article-preview pre code { background: none; padding: 0; color: #f8fafc; }
        .article-preview ul, .article-preview ol { padding-right: 1.5rem; padding-left: 0; margin: 0.5rem 0; }
        .article-preview li { margin: 0.3rem 0; }
        .article-preview blockquote { border-right: 3px solid #22c55e; border-left: none; padding: 0.5rem 1rem 0.5rem 0; margin: 1rem 0; color: rgba(248,250,252,0.6); }
        .article-preview hr { border: none; border-top: 1px solid rgba(255,255,255,0.08); margin: 1.5rem 0; }

        /* Custom color spans */
        .md-green  { color: #22c55e; }
        .md-red    { color: rgb(239,68,68); }
        .md-purple { color: #a78bfa; }

        /* Editor textarea */
        .article-textarea {
          width: 100%;
          height: 100%;
          min-height: 400px;
          padding: 1.25rem;
          border-radius: 12px;
          border: 1.5px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.03);
          color: #f8fafc;
          font-family: 'IBM Plex Arabic', 'Syne', monospace;
          font-size: 0.92rem;
          line-height: 1.9;
          resize: vertical;
          outline: none;
          box-sizing: border-box;
          direction: rtl;
          text-align: right;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .article-textarea:focus {
          border-color: #22c55e;
          box-shadow: 0 0 0 3px rgba(34,197,94,0.1);
        }
        .article-textarea::placeholder { color: rgba(248,250,252,0.2); }

        /* Cheatsheet */
        .cheat-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.3rem 0;
          font-family: var(--font-body, Syne, sans-serif);
          font-size: 0.75rem;
          color: rgba(248,250,252,0.45);
          border-bottom: 1px solid rgba(255,255,255,0.04);
        }
        .cheat-code {
          font-family: monospace;
          font-size: 0.72rem;
          color: #22c55e;
          background: rgba(34,197,94,0.08);
          padding: 1px 6px;
          border-radius: 4px;
          white-space: nowrap;
        }
      `}</style>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          background: "#090b0e",
        }}
      >
        {/* ── Top bar ──────────────────────────────────────────── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "1rem 1.5rem",
            borderBottom: "1px solid rgba(34,197,94,0.1)",
            flexShrink: 0,
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <button
              onClick={() => router.push("/dashboard/articles")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                background: "transparent",
                border: "none",
                color: "rgba(248,250,252,0.5)",
                cursor: "pointer",
                fontFamily: "var(--font-body,Syne,sans-serif)",
                fontSize: "0.82rem",
                fontWeight: 600,
                padding: "0.4rem 0.75rem",
                borderRadius: "7px",
                transition: "color 0.15s, background 0.15s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = "#f8fafc";
                (e.currentTarget as HTMLButtonElement).style.background =
                  "rgba(255,255,255,0.05)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color =
                  "rgba(248,250,252,0.5)";
                (e.currentTarget as HTMLButtonElement).style.background =
                  "transparent";
              }}
            >
              <ArrowLeft size={15} /> Back
            </button>
            <span
              style={{
                fontFamily: "var(--font-pixel,'Press Start 2P',monospace)",
                fontSize: "0.5rem",
                color: "#22c55e",
                opacity: 0.7,
              }}
            >
              {isNew ? "New Article" : "Edit Article"}
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              flexWrap: "wrap",
            }}
          >
            {/* Read time */}
            <span
              style={{
                fontFamily: "var(--font-body,Syne,sans-serif)",
                fontSize: "0.75rem",
                color: "rgba(248,250,252,0.35)",
              }}
            >
              ~{readTime} min read
            </span>

            {/* Hidden toggle */}
            <button
              onClick={() => setForm((f) => ({ ...f, hidden: !f.hidden }))}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "0.4rem 0.85rem",
                borderRadius: "7px",
                border: "1px solid",
                fontFamily: "var(--font-body,Syne,sans-serif)",
                fontSize: "0.78rem",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.15s",
                borderColor: form.hidden
                  ? "rgba(255,255,255,0.15)"
                  : "rgba(34,197,94,0.3)",
                background: form.hidden
                  ? "rgba(255,255,255,0.04)"
                  : "rgba(34,197,94,0.06)",
                color: form.hidden ? "rgba(248,250,252,0.45)" : "#22c55e",
              }}
            >
              {form.hidden ? <EyeOff size={13} /> : <Eye size={13} />}
              {form.hidden ? "Hidden" : "Visible"}
            </button>

            {/* Preview toggle */}
            <button
              onClick={() => setPreview((p) => !p)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "0.4rem 0.85rem",
                borderRadius: "7px",
                border: "1px solid rgba(255,255,255,0.1)",
                background: preview ? "rgba(255,255,255,0.06)" : "transparent",
                color: "rgba(248,250,252,0.6)",
                fontFamily: "var(--font-body,Syne,sans-serif)",
                fontSize: "0.78rem",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              <Eye size={13} /> {preview ? "Hide Preview" : "Show Preview"}
            </button>

            {/* Save */}
            <button
              onClick={handleSubmit as any}
              disabled={loading || saved}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "0.5rem 1.25rem",
                borderRadius: "9px",
                border: "1.5px solid #22c55e",
                background: saved ? "rgba(34,197,94,0.15)" : "#22c55e",
                color: saved ? "#22c55e" : "#090b0e",
                fontFamily: "var(--font-body,Syne,sans-serif)",
                fontWeight: 700,
                fontSize: "0.82rem",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
                transition: "all 0.2s",
              }}
            >
              {loading ? (
                <Loader2
                  size={14}
                  style={{ animation: "spin 0.7s linear infinite" }}
                />
              ) : (
                <Save size={14} />
              )}
              {saved
                ? "Saved!"
                : loading
                  ? "Saving..."
                  : isNew
                    ? "Publish"
                    : "Save"}
            </button>
          </div>
        </div>

        {/* ── Meta fields ─────────────────────────────────────── */}
        <div
          style={{
            padding: "1.25rem 1.5rem",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
            display: "grid",
            gridTemplateColumns: "1fr 240px",
            gap: "1.25rem",
            flexShrink: 0,
            alignItems: "start",
          }}
        >
          {/* Left: title + author stacked */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <Field label="Title" required>
              <Input
                value={form.title}
                onChange={set("title")}
                placeholder="Article title..."
              />
            </Field>
            <Field label="Author">
              <Input
                value={form.author}
                onChange={set("author")}
                placeholder="3bod Sa"
              />
            </Field>
          </div>
          {/* Right: cover upload — 16:9 landscape */}
          <div style={{ width: "240px", flexShrink: 0 }}>
            <ImageUpload
              value={form.cover}
              onChange={(url) => setForm((f) => ({ ...f, cover: url }))}
            />
          </div>
        </div>

        {error && (
          <div
            style={{
              margin: "0.75rem 1.5rem 0",
              padding: "0.6rem 1rem",
              borderRadius: "8px",
              background: "rgba(239,68,68,0.08)",
              border: "1px solid rgba(239,68,68,0.2)",
              color: "rgb(239,68,68)",
              fontFamily: "var(--font-body,Syne,sans-serif)",
              fontSize: "0.82rem",
            }}
          >
            {error}
          </div>
        )}

        {/* ── Editor + Preview ────────────────────────────────── */}
        <div
          style={{
            flex: 1,
            display: "grid",
            gridTemplateColumns: preview ? "1fr 1fr" : "1fr",
            gap: 0,
            overflow: "hidden",
          }}
        >
          {/* Editor */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              borderRight: preview
                ? "1px solid rgba(255,255,255,0.05)"
                : "none",
              overflow: "hidden",
            }}
          >
            {/* Editor header */}
            <div
              style={{
                padding: "0.6rem 1.25rem",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-pixel,'Press Start 2P',monospace)",
                  fontSize: "0.38rem",
                  color: "rgba(248,250,252,0.3)",
                  letterSpacing: "0.1em",
                }}
              >
                EDITOR
              </span>
              <div style={{ display: "flex", gap: "1rem" }}>
                {[
                  { code: "::g[نص]", label: "green" },
                  { code: "::d[نص]", label: "red" },
                  { code: "::p[نص]", label: "purple" },
                  { code: "[رابط](url)", label: "link" },
                ].map(({ code, label }) => (
                  <span
                    key={label}
                    className="cheat-item"
                    style={{ border: "none", padding: 0 }}
                  >
                    <code className="cheat-code">{code}</code>
                  </span>
                ))}
              </div>
            </div>
            <div style={{ flex: 1, padding: "1rem 1.25rem", overflow: "auto" }}>
              <textarea
                className="article-textarea"
                value={form.content}
                onChange={set("content")}
                placeholder="اكتب مقالك هنا... يمكنك استخدام Markdown&#10;&#10;# عنوان رئيسي&#10;## عنوان فرعي&#10;&#10;::g[نص أخضر]&#10;::d[نص أحمر]&#10;::p[نص بنفسجي]&#10;&#10;[رابط](https://example.com)"
                style={{ height: "100%" }}
              />
            </div>
          </div>

          {/* Preview */}
          {preview && (
            <div
              style={{
                overflow: "auto",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  padding: "0.6rem 1.25rem",
                  borderBottom: "1px solid rgba(255,255,255,0.05)",
                  flexShrink: 0,
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-pixel,'Press Start 2P',monospace)",
                    fontSize: "0.38rem",
                    color: "rgba(248,250,252,0.3)",
                    letterSpacing: "0.1em",
                  }}
                >
                  PREVIEW
                </span>
              </div>
              <div style={{ flex: 1, padding: "1.5rem", overflowY: "auto" }}>
                {form.title && (
                  <h1
                    style={{
                      fontFamily: "'IBM Plex Arabic', Syne, sans-serif",
                      fontSize: "1.6rem",
                      fontWeight: 700,
                      color: "#f8fafc",
                      marginBottom: "1.5rem",
                      direction: "rtl",
                      textAlign: "right",
                    }}
                  >
                    {form.title}
                  </h1>
                )}
                {form.content ? (
                  <MarkdownPreview content={form.content} />
                ) : (
                  <p
                    style={{
                      fontFamily: "var(--font-body,Syne,sans-serif)",
                      color: "rgba(248,250,252,0.2)",
                      fontStyle: "italic",
                    }}
                  >
                    Preview will appear here...
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}
