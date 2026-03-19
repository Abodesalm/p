"use client";

import { Trash2, X } from "lucide-react";

interface ConfirmDeleteProps {
  open: boolean;
  label: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function ConfirmDelete({
  open,
  label,
  onConfirm,
  onCancel,
  loading,
}: ConfirmDeleteProps) {
  if (!open) return null;
  return (
    <>
      <style>{`
        @keyframes popIn { from{opacity:0;transform:scale(0.95)} to{opacity:1;transform:scale(1)} }
        .confirm-dialog { animation: popIn 0.18s ease forwards; }
      `}</style>
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(0,0,0,0.65)",
          backdropFilter: "blur(4px)",
        }}
        onClick={onCancel}
      >
        <div
          className="confirm-dialog"
          onClick={(e) => e.stopPropagation()}
          style={{
            background: "#0d1117",
            border: "1px solid rgba(239,68,68,0.25)",
            borderRadius: "16px",
            padding: "2rem",
            width: "min(400px,90vw)",
            boxShadow: "0 24px 60px rgba(0,0,0,0.6)",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "1.25rem",
            }}
          >
            <Trash2 size={20} style={{ color: "rgb(239,68,68)" }} />
          </div>
          <h3
            style={{
              fontFamily: "var(--font-body,Syne,sans-serif)",
              fontSize: "1rem",
              fontWeight: 700,
              color: "#f8fafc",
              margin: "0 0 0.5rem 0",
            }}
          >
            Delete this item?
          </h3>
          <p
            style={{
              fontFamily: "var(--font-body,Syne,sans-serif)",
              fontSize: "0.85rem",
              color: "rgba(248,250,252,0.55)",
              margin: "0 0 1.5rem 0",
              lineHeight: 1.6,
            }}
          >
            You're about to delete{" "}
            <strong style={{ color: "#f8fafc" }}>"{label}"</strong>. This action
            cannot be undone.
          </p>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button
              onClick={onCancel}
              style={{
                flex: 1,
                padding: "0.65rem",
                borderRadius: "9px",
                border: "1px solid rgba(255,255,255,0.1)",
                background: "transparent",
                color: "rgba(248,250,252,0.6)",
                fontFamily: "var(--font-body,Syne,sans-serif)",
                fontSize: "0.83rem",
                fontWeight: 600,
                cursor: "pointer",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.background =
                  "rgba(255,255,255,0.05)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.background =
                  "transparent")
              }
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              style={{
                flex: 1,
                padding: "0.65rem",
                borderRadius: "9px",
                border: "none",
                background: "rgb(239,68,68)",
                color: "#fff",
                fontFamily: "var(--font-body,Syne,sans-serif)",
                fontSize: "0.83rem",
                fontWeight: 700,
                cursor: "pointer",
                opacity: loading ? 0.7 : 1,
                transition: "opacity 0.15s, box-shadow 0.15s",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.boxShadow =
                  "0 0 16px rgba(239,68,68,0.4)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.boxShadow =
                  "none")
              }
            >
              {loading ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
