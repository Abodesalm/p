"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Calendar,
  ExternalLink,
  Github,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const PAD = "clamp(1rem, 8vw, 10rem)";

interface Action {
  label: string;
  url: string;
}
interface Project {
  _id: string;
  title: string;
  desc?: string;
  date?: string;
  type?: string;
  cover?: string;
  media?: string[];
  tags?: string[];
  action1?: Action | null;
  action2?: Action | null;
}
interface Props {
  project: Project;
}

const isVideo = (url: string) =>
  /\.(mp4|webm|ogg|mov)(\?|$)/i.test(url) || url.includes("/video/");

// ── Lightbox ──────────────────────────────────────────────────────────────────
function Lightbox({
  media,
  index,
  onClose,
}: {
  media: string[];
  index: number;
  onClose: () => void;
}) {
  const [current, setCurrent] = useState(index);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") setCurrent((c) => Math.max(0, c - 1));
      if (e.key === "ArrowRight")
        setCurrent((c) => Math.min(media.length - 1, c + 1));
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [media.length, onClose]);

  return (
    <>
      <style>{`@keyframes lbFade{from{opacity:0}to{opacity:1}}.lightbox{animation:lbFade 0.2s ease forwards;}`}</style>
      <div
        className="lightbox"
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 100,
          background: "rgba(0,0,0,0.95)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backdropFilter: "blur(8px)",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "1.5rem",
            right: "1.5rem",
            width: "40px",
            height: "40px",
            borderRadius: "10px",
            border: "1px solid rgba(255,255,255,0.15)",
            background: "rgba(255,255,255,0.08)",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            zIndex: 1,
          }}
        >
          <X size={18} />
        </button>
        <div
          style={{
            position: "absolute",
            top: "1.5rem",
            left: "50%",
            transform: "translateX(-50%)",
            fontFamily: "var(--font-pixel,'Press Start 2P',monospace)",
            fontSize: "0.45rem",
            color: "rgba(255,255,255,0.5)",
          }}
        >
          {current + 1} / {media.length}
        </div>
        {current > 0 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setCurrent((c) => c - 1);
            }}
            style={{
              position: "absolute",
              left: "1.5rem",
              width: "44px",
              height: "44px",
              borderRadius: "12px",
              border: "1px solid rgba(255,255,255,0.15)",
              background: "rgba(255,255,255,0.08)",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <ChevronLeft size={20} />
          </button>
        )}
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            maxWidth: "90vw",
            maxHeight: "85vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          {isVideo(media[current]) ? (
            <video
              src={media[current]}
              controls
              autoPlay
              style={{
                maxWidth: "90vw",
                maxHeight: "85vh",
                borderRadius: "12px",
              }}
            />
          ) : (
            <img
              src={media[current]}
              alt=""
              style={{
                maxWidth: "90vw",
                maxHeight: "85vh",
                objectFit: "contain",
                borderRadius: "12px",
                display: "block",
              }}
            />
          )}
        </div>
        {current < media.length - 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setCurrent((c) => c + 1);
            }}
            style={{
              position: "absolute",
              right: "1.5rem",
              width: "44px",
              height: "44px",
              borderRadius: "12px",
              border: "1px solid rgba(255,255,255,0.15)",
              background: "rgba(255,255,255,0.08)",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <ChevronRight size={20} />
          </button>
        )}
        {media.length > 1 && (
          <div
            style={{
              position: "absolute",
              bottom: "1.5rem",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              gap: "6px",
              padding: "8px",
              borderRadius: "12px",
              background: "rgba(255,255,255,0.06)",
              backdropFilter: "blur(8px)",
            }}
          >
            {media.map((url, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrent(i);
                }}
                style={{
                  width: "40px",
                  height: "28px",
                  borderRadius: "6px",
                  overflow: "hidden",
                  border: `2px solid ${i === current ? "#22c55e" : "transparent"}`,
                  padding: 0,
                  cursor: "pointer",
                  transition: "border-color 0.15s",
                  flexShrink: 0,
                  background: "transparent",
                }}
              >
                {isVideo(url) ? (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      background: "rgba(255,255,255,0.1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.5rem",
                      color: "#22c55e",
                    }}
                  >
                    ▶
                  </div>
                ) : (
                  <img
                    src={url}
                    alt=""
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function ProjectPage({ project }: Props) {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [lightbox, setLightbox] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
    setTimeout(() => setVisible(true), 80);
  }, []);

  const current = theme === "system" ? systemTheme : theme;
  const isDark = mounted ? current === "dark" : true;
  const bg = isDark ? "#090b0e" : "#f8fafc";
  const textMain = isDark ? "#f8fafc" : "#090b0e";
  const textMuted = isDark ? "rgba(248,250,252,0.55)" : "rgba(9,11,14,0.55)";
  const cardBorder = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)";

  const media = project.media || [];
  const isGH = (url: string) => url.includes("github.com");

  return (
    <>
      <style>{`
        .proj-tag { display:inline-flex; align-items:center; padding:3px 12px; border-radius:999px; font-family:var(--font-body,Syne,sans-serif); font-size:0.7rem; font-weight:700; letter-spacing:0.05em; text-transform:uppercase; border:1px solid rgba(34,197,94,0.25); background:rgba(34,197,94,0.07); color:#22c55e; }
        .action-btn { display:inline-flex; align-items:center; gap:7px; padding:0.7rem 1.5rem; border-radius:10px; text-decoration:none; font-family:var(--font-body,Syne,sans-serif); font-size:0.82rem; font-weight:700; letter-spacing:0.06em; text-transform:uppercase; border:1.5px solid; cursor:pointer; transition:background 0.2s,box-shadow 0.2s,transform 0.2s; }
        .action-btn.primary { background:#22c55e; border-color:#22c55e; color:#090b0e; }
        .action-btn.primary:hover { background:transparent; color:#22c55e; box-shadow:0 0 20px rgba(34,197,94,0.3); transform:translateY(-2px); }
        .action-btn.ghost { background:transparent; border-color:rgba(34,197,94,0.3); }
        .action-btn.ghost:hover { border-color:#22c55e; background:rgba(34,197,94,0.08); box-shadow:0 0 16px rgba(34,197,94,0.15); transform:translateY(-2px); }
        .media-item { border-radius:12px; overflow:hidden; border:1px solid rgba(255,255,255,0.07); cursor:zoom-in; transition:transform 0.25s,box-shadow 0.25s,border-color 0.25s; }
        .media-item:hover { transform:translateY(-4px); box-shadow:0 12px 32px rgba(0,0,0,0.4); border-color:rgba(34,197,94,0.3); }
        .back-link { display:inline-flex; align-items:center; gap:6px; font-family:var(--font-body,Syne,sans-serif); font-size:0.82rem; font-weight:600; color:${textMuted}; text-decoration:none; transition:color 0.2s; }
        .back-link:hover { color:#22c55e; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .fade-1 { opacity:0; animation:fadeUp 0.6s ease 0.05s forwards; }
        .fade-2 { opacity:0; animation:fadeUp 0.6s ease 0.15s forwards; }
        .fade-3 { opacity:0; animation:fadeUp 0.6s ease 0.25s forwards; }
      `}</style>

      {/* Cover */}
      {project.cover && (
        <div
          style={{
            width: "100%",
            maxHeight: "520px",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <Image
            src={project.cover}
            alt={project.title}
            width={1600}
            height={640}
            priority
            style={{
              width: "100%",
              maxHeight: "520px",
              objectFit: "cover",
              display: "block",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(to bottom,transparent 30%,${bg} 100%)`,
            }}
          />
        </div>
      )}

      <div
        style={{
          background: bg,
          minHeight: "100vh",
          transition: "background 0.3s",
        }}
      >
        <div
          style={{
            paddingLeft: PAD,
            paddingRight: PAD,
            paddingTop: project.cover ? "1.5rem" : "7rem",
            paddingBottom: "6rem",
          }}
        >
          {/* Back */}
          <div
            className={visible ? "fade-1" : ""}
            style={{ marginBottom: "2rem" }}
          >
            <Link href="/projects" className="back-link">
              <ArrowRight size={14} /> Back to Projects
            </Link>
          </div>

          {/* Header */}
          <div
            className={visible ? "fade-1" : ""}
            style={{ marginBottom: "2.5rem" }}
          >
            <h1
              style={{
                fontFamily: "var(--font-pixel,'Press Start 2P',monospace)",
                fontSize: "clamp(1rem,3vw,1.8rem)",
                color: textMain,
                marginBottom: "1.25rem",
                lineHeight: 1.5,
              }}
            >
              {project.title}
            </h1>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1.25rem",
                flexWrap: "wrap",
                marginBottom: "1.25rem",
              }}
            >
              {project.type && (
                <span
                  style={{
                    fontFamily: "var(--font-pixel,'Press Start 2P',monospace)",
                    fontSize: "0.42rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "#22c55e",
                    opacity: 0.8,
                  }}
                >
                  {project.type}
                </span>
              )}
              {project.date && (
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "5px",
                    fontFamily: "var(--font-body,Syne,sans-serif)",
                    fontSize: "0.8rem",
                    color: textMuted,
                  }}
                >
                  <Calendar size={13} style={{ color: "#22c55e" }} />
                  {project.date}
                </span>
              )}
            </div>
            {project.tags && project.tags.length > 0 && (
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "0.5rem",
                  marginBottom: "1.5rem",
                }}
              >
                {project.tags.map((t) => (
                  <span key={t} className="proj-tag">
                    {t}
                  </span>
                ))}
              </div>
            )}
            {project.desc && (
              <p
                style={{
                  fontFamily: "var(--font-body,Syne,sans-serif)",
                  fontSize: "clamp(0.9rem,1.5vw,1.05rem)",
                  color: textMuted,
                  lineHeight: 1.85,
                  maxWidth: "800px",
                  margin: 0,
                }}
              >
                {project.desc}
              </p>
            )}
          </div>

          {/* Actions */}
          {(project.action1 || project.action2) && (
            <div
              className={visible ? "fade-2" : ""}
              style={{
                display: "flex",
                gap: "0.75rem",
                flexWrap: "wrap",
                marginBottom: "3.5rem",
              }}
            >
              {project.action1 && (
                <a
                  href={project.action1.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="action-btn primary"
                >
                  <ExternalLink size={15} />
                  {project.action1.label}
                </a>
              )}
              {project.action2 && (
                <a
                  href={project.action2.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="action-btn ghost"
                  style={{ color: textMain }}
                >
                  {isGH(project.action2.url) ? (
                    <Github size={15} />
                  ) : (
                    <ExternalLink size={15} />
                  )}
                  {project.action2.label}
                </a>
              )}
            </div>
          )}

          {/* Media gallery */}
          {media.length > 0 && (
            <div className={visible ? "fade-3" : ""}>
              <p
                style={{
                  fontFamily: "var(--font-pixel,'Press Start 2P',monospace)",
                  fontSize: "0.45rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#22c55e",
                  opacity: 0.7,
                  marginBottom: "1.25rem",
                }}
              >
                Gallery
              </p>

              {/* First — full width */}
              <div
                className="media-item"
                style={{ marginBottom: "1rem", position: "relative" }}
                onClick={() => setLightbox(0)}
              >
                {isVideo(media[0]) ? (
                  <video
                    src={media[0]}
                    style={{
                      width: "100%",
                      maxHeight: "520px",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                ) : (
                  <Image
                    src={media[0]}
                    alt=""
                    width={1600}
                    height={900}
                    priority
                    style={{
                      width: "100%",
                      maxHeight: "520px",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                )}
              </div>

              {/* Rest — 2-col grid */}
              {media.length > 1 && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(min(100%, 340px), 1fr))",
                    gap: "1rem",
                  }}
                >
                  {media.slice(1).map((url, i) => (
                    <div
                      key={i}
                      className="media-item"
                      onClick={() => setLightbox(i + 1)}
                    >
                      {isVideo(url) ? (
                        <div style={{ position: "relative" }}>
                          <video
                            src={url}
                            style={{
                              width: "100%",
                              aspectRatio: "16/9",
                              objectFit: "cover",
                              display: "block",
                            }}
                          />
                          <div
                            style={{
                              position: "absolute",
                              inset: 0,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              background: "rgba(0,0,0,0.3)",
                            }}
                          >
                            <div
                              style={{
                                width: "48px",
                                height: "48px",
                                borderRadius: "50%",
                                background: "rgba(255,255,255,0.15)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                backdropFilter: "blur(4px)",
                              }}
                            >
                              <span
                                style={{
                                  color: "#fff",
                                  fontSize: "1.2rem",
                                  marginLeft: "3px",
                                }}
                              >
                                ▶
                              </span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div
                          style={{ position: "relative", aspectRatio: "16/9" }}
                        >
                          <Image
                            src={url}
                            alt=""
                            fill
                            sizes="(max-width:768px) 100vw, 50vw"
                            style={{ objectFit: "cover" }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {lightbox !== null && (
        <Lightbox
          media={media}
          index={lightbox}
          onClose={() => setLightbox(null)}
        />
      )}
    </>
  );
}
