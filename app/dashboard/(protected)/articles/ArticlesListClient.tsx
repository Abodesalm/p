"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Pencil,
  Trash2,
  FileText,
  EyeOff,
  Eye,
  Clock,
} from "lucide-react";
import { revalidate } from "../_components/revalidate";
import ConfirmDelete from "../_components/ConfirmDelete";

interface ArticleDoc {
  _id: string;
  title: string;
  author?: string;
  date?: string;
  hidden?: boolean;
  readTime?: number;
  createdAt?: string;
}
interface Props {
  initial: ArticleDoc[];
}

const fetchOpts = (method: string, body?: object) => ({
  method,
  credentials: "include" as const,
  headers: { "Content-Type": "application/json" },
  ...(body ? { body: JSON.stringify(body) } : {}),
});

export default function ArticlesListClient({ initial }: Props) {
  const router = useRouter();
  const [docs, setDocs] = useState<ArticleDoc[]>(initial);
  const [delId, setDelId] = useState<string | null>(null);
  const [delLabel, setDelLabel] = useState("");
  const [delLoading, setDelLoading] = useState(false);

  const handleDelete = async () => {
    if (!delId) return;
    setDelLoading(true);
    try {
      await fetch(`/api/articles/${delId}`, fetchOpts("DELETE"));
      setDocs((d) => d.filter((x) => x._id !== delId));
      setDelId(null);
      revalidate("articles");
    } finally {
      setDelLoading(false);
    }
  };

  const toggleHidden = async (doc: ArticleDoc) => {
    const res = await fetch(
      `/api/articles/${doc._id}`,
      fetchOpts("PATCH", { hidden: !doc.hidden }),
    );
    const data = await res.json();
    if (data.data) {
      setDocs((d) => d.map((x) => (x._id === doc._id ? data.data : x)));
      revalidate("articles");
    }
  };

  const formatDate = (d?: string) => {
    if (!d) return "";
    return new Date(d).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
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
            Articles
          </h1>
        </div>
        <button
          onClick={() => router.push("/dashboard/articles/new")}
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
          <Plus size={15} /> New Article
        </button>
      </div>

      {/* Count */}
      <p
        style={{
          fontFamily: "var(--font-pixel,'Press Start 2P',monospace)",
          fontSize: "0.38rem",
          color: "rgba(34,197,94,0.6)",
          letterSpacing: "0.1em",
          marginBottom: "1.25rem",
        }}
      >
        {docs.length} article{docs.length !== 1 ? "s" : ""} —{" "}
        {docs.filter((d) => d.hidden).length} hidden
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
                border: `1px solid ${doc.hidden ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.07)"}`,
                background: doc.hidden
                  ? "rgba(255,255,255,0.01)"
                  : "rgba(255,255,255,0.02)",
                opacity: doc.hidden ? 0.6 : 1,
                transition: "border-color 0.15s, opacity 0.2s",
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
              {/* Icon */}
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  background: "rgba(244,114,182,0.08)",
                  border: "1px solid rgba(244,114,182,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <FileText size={17} style={{ color: "#f472b6" }} />
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
                        gap: "4px",
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
                      <EyeOff size={9} /> hidden
                    </span>
                  )}
                </div>
                <div
                  style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}
                >
                  {doc.author && (
                    <span
                      style={{
                        fontFamily: "var(--font-body,Syne,sans-serif)",
                        fontSize: "0.75rem",
                        color: "rgba(248,250,252,0.4)",
                      }}
                    >
                      {doc.author}
                    </span>
                  )}
                  {doc.date && (
                    <span
                      style={{
                        fontFamily: "var(--font-body,Syne,sans-serif)",
                        fontSize: "0.75rem",
                        color: "rgba(248,250,252,0.3)",
                      }}
                    >
                      {formatDate(doc.date)}
                    </span>
                  )}
                  {doc.readTime && (
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "3px",
                        fontFamily: "var(--font-body,Syne,sans-serif)",
                        fontSize: "0.72rem",
                        color: "rgba(248,250,252,0.3)",
                      }}
                    >
                      <Clock size={10} /> {doc.readTime} min read
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
                {/* Toggle hidden */}
                <ActionBtn
                  onClick={() => toggleHidden(doc)}
                  color="rgba(248,250,252,0.4)"
                  hoverColor={doc.hidden ? "#22c55e" : "rgba(248,250,252,0.7)"}
                  hoverBg={
                    doc.hidden
                      ? "rgba(34,197,94,0.1)"
                      : "rgba(255,255,255,0.06)"
                  }
                  title={doc.hidden ? "Make visible" : "Hide"}
                >
                  {doc.hidden ? <Eye size={13} /> : <EyeOff size={13} />}
                </ActionBtn>
                {/* Edit */}
                <ActionBtn
                  onClick={() => router.push(`/dashboard/articles/${doc._id}`)}
                  color="rgba(248,250,252,0.5)"
                  hoverColor="#22c55e"
                  hoverBg="rgba(34,197,94,0.1)"
                  title="Edit"
                >
                  <Pencil size={13} />
                </ActionBtn>
                {/* Delete */}
                <ActionBtn
                  onClick={() => {
                    setDelId(doc._id);
                    setDelLabel(doc.title);
                  }}
                  color="rgba(248,250,252,0.5)"
                  hoverColor="rgb(239,68,68)"
                  hoverBg="rgba(239,68,68,0.1)"
                  title="Delete"
                >
                  <Trash2 size={13} />
                </ActionBtn>
              </div>
            </div>
          ))}
        </div>
      )}

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
      <FileText
        size={32}
        style={{ color: "rgba(244,114,182,0.3)", marginBottom: "1rem" }}
      />
      <p
        style={{
          fontFamily: "var(--font-body,Syne,sans-serif)",
          color: "rgba(248,250,252,0.3)",
          margin: 0,
        }}
      >
        No articles yet. Write your first one!
      </p>
    </div>
  );
}

function ActionBtn({
  onClick,
  color,
  hoverColor,
  hoverBg,
  title,
  children,
}: any) {
  return (
    <button
      onClick={onClick}
      title={title}
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
