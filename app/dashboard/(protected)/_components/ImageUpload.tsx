"use client";

import { useState, useRef } from "react";
import { Upload, X, ImageIcon, Loader2 } from "lucide-react";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export default function ImageUpload({
  value,
  onChange,
  label = "Cover Image",
}: ImageUploadProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [drag, setDrag] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Only image files are allowed.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("Max file size is 10 MB.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);
      formData.append("folder", "portfolio");

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        },
      );

      const data = await res.json();

      if (!res.ok || !data.secure_url) {
        setError(
          data.error?.message ||
            "Upload failed. Check your Cloudinary credentials.",
        );
        return;
      }

      onChange(data.secure_url);
    } catch {
      setError("Network error during upload.");
    } finally {
      setLoading(false);
    }
  };

  const handleFile = (file: File | undefined) => {
    if (file) upload(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDrag(false);
    handleFile(e.dataTransfer.files[0]);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
      <label
        style={{
          fontFamily: "var(--font-body,Syne,sans-serif)",
          fontSize: "0.75rem",
          fontWeight: 700,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: "rgba(248,250,252,0.55)",
        }}
      >
        {label}
      </label>

      {value ? (
        /* ── Preview ─────────────────────────────────────── */
        <div
          style={{
            position: "relative",
            borderRadius: "12px",
            overflow: "hidden",
            border: "1.5px solid rgba(34,197,94,0.3)",
            width: "100%",
            maxWidth: "280px",
            aspectRatio: "16/9",
          }}
        >
          <img
            src={value}
            alt="cover"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
          {/* Remove button */}
          <button
            type="button"
            onClick={() => onChange("")}
            style={{
              position: "absolute",
              top: "8px",
              right: "8px",
              width: "30px",
              height: "30px",
              borderRadius: "8px",
              border: "none",
              background: "rgba(0,0,0,0.6)",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              backdropFilter: "blur(4px)",
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.background =
                "rgba(239,68,68,0.8)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.background =
                "rgba(0,0,0,0.6)")
            }
          >
            <X size={14} />
          </button>
          {/* Replace button */}
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            style={{
              position: "absolute",
              bottom: "8px",
              right: "8px",
              display: "flex",
              alignItems: "center",
              gap: "5px",
              padding: "5px 10px",
              borderRadius: "7px",
              border: "none",
              background: "rgba(0,0,0,0.6)",
              color: "#fff",
              fontFamily: "var(--font-body,Syne,sans-serif)",
              fontSize: "0.72rem",
              fontWeight: 600,
              cursor: "pointer",
              backdropFilter: "blur(4px)",
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.background =
                "rgba(34,197,94,0.8)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.background =
                "rgba(0,0,0,0.6)")
            }
          >
            <Upload size={11} /> Replace
          </button>
        </div>
      ) : (
        /* ── Drop zone ───────────────────────────────────── */
        <div
          onClick={() => !loading && inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDrag(true);
          }}
          onDragLeave={() => setDrag(false)}
          onDrop={handleDrop}
          style={{
            width: "100%",
            maxWidth: "280px",
            aspectRatio: "16/9",
            borderRadius: "10px",
            border: `2px dashed ${drag ? "#22c55e" : "rgba(255,255,255,0.12)"}`,
            background: drag
              ? "rgba(34,197,94,0.06)"
              : "rgba(255,255,255,0.02)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            cursor: loading ? "not-allowed" : "pointer",
            transition: "border-color 0.2s, background 0.2s",
            boxSizing: "border-box",
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              (e.currentTarget as HTMLDivElement).style.borderColor =
                "rgba(34,197,94,0.4)";
              (e.currentTarget as HTMLDivElement).style.background =
                "rgba(34,197,94,0.04)";
            }
          }}
          onMouseLeave={(e) => {
            if (!drag) {
              (e.currentTarget as HTMLDivElement).style.borderColor =
                "rgba(255,255,255,0.12)";
              (e.currentTarget as HTMLDivElement).style.background =
                "rgba(255,255,255,0.02)";
            }
          }}
        >
          {loading ? (
            <>
              <Loader2
                size={20}
                style={{
                  color: "#22c55e",
                  animation: "spin 0.7s linear infinite",
                }}
              />
              <span
                style={{
                  fontFamily: "var(--font-body,Syne,sans-serif)",
                  fontSize: "0.8rem",
                  color: "rgba(248,250,252,0.45)",
                }}
              >
                Uploading...
              </span>
            </>
          ) : (
            <>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "9px",
                  background: "rgba(34,197,94,0.08)",
                  border: "1px solid rgba(34,197,94,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ImageIcon
                  size={16}
                  style={{ color: "#22c55e", opacity: 0.7 }}
                />
              </div>
              <div style={{ textAlign: "center" }}>
                <p
                  style={{
                    fontFamily: "var(--font-body,Syne,sans-serif)",
                    fontSize: "0.78rem",
                    fontWeight: 600,
                    color: "rgba(248,250,252,0.6)",
                    margin: "0 0 2px 0",
                  }}
                >
                  Click to upload or drag & drop
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-body,Syne,sans-serif)",
                    fontSize: "0.72rem",
                    color: "rgba(248,250,252,0.3)",
                    margin: 0,
                  }}
                >
                  PNG, JPG, WebP — max 10 MB
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {/* Error */}
      {error && (
        <p
          style={{
            fontFamily: "var(--font-body,Syne,sans-serif)",
            fontSize: "0.75rem",
            color: "rgb(239,68,68)",
            margin: 0,
          }}
        >
          {error}
        </p>
      )}

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
