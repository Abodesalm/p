"use client";

import Link from "next/link";
import Image from "next/image";
import { BsCalendar3, BsGithub, BsBoxArrowUpRight } from "react-icons/bs";

interface Action {
  label: string;
  url: string;
}
interface Project {
  _id: string;
  title: string;
  desc?: string;
  date?: string;
  cover?: string;
  tags?: string[];
  action1?: Action | null;
  action2?: Action | null;
}

interface ProjectCardProps {
  project: Project;
  index?: number;
  cardBg: string;
  cardBorder: string;
  textMain: string;
  textMuted: string;
  isDark: boolean;
  highlightedTags?: string[];
  onTagClick?: (tag: string) => void;
}

function formatDate(d: string) {
  const [y, m] = d.split("-");
  if (!y || !m) return d;
  return `${new Date(`${y}-${m}-01`).toLocaleString("default", { month: "short" })} ${y}`;
}

export default function ProjectCard({
  project: p,
  index = 0,
  cardBg,
  cardBorder,
  textMain,
  textMuted,
  isDark,
  highlightedTags = [],
  onTagClick,
}: ProjectCardProps) {
  return (
    <>
      <style>{`
        .proj-card { border-radius:16px; border:1px solid; overflow:hidden; display:flex; flex-direction:column; text-decoration:none; position:relative; transition:transform 0.3s,box-shadow 0.3s,border-color 0.3s; }
        .proj-card:hover { transform:translateY(-6px); box-shadow:0 20px 48px rgba(34,197,94,0.1); border-color:rgba(34,197,94,0.3) !important; }
        .cover-wrap { overflow:hidden; position:relative; aspect-ratio:16/9; }
        .proj-cover { object-fit:cover; transition:transform 0.4s; }
        .proj-card:hover .proj-cover { transform:scale(1.03); }
        .cover-overlay { position:absolute; inset:0; background:linear-gradient(to bottom,transparent 50%,rgba(9,11,14,0.7) 100%); opacity:0; transition:opacity 0.3s; }
        .proj-card:hover .cover-overlay { opacity:1; }
        .proj-tag { font-family:var(--font-body,Syne,sans-serif); font-size:0.65rem; font-weight:700; letter-spacing:0.05em; text-transform:uppercase; padding:3px 10px; border-radius:999px; border:1px solid rgba(34,197,94,0.25); background:rgba(34,197,94,0.07); color:#22c55e; white-space:nowrap; transition:background 0.15s,border-color 0.15s; }
        .proj-tag.highlighted { background:rgba(34,197,94,0.18); border-color:rgba(34,197,94,0.5); }
        .proj-tag:hover { background:rgba(34,197,94,0.15); border-color:rgba(34,197,94,0.4); }
        .proj-title { font-family:var(--font-body,Syne,sans-serif); font-size:1.05rem; font-weight:700; letter-spacing:0.02em; margin:0; }
        .proj-desc  { font-family:var(--font-body,Syne,sans-serif); font-size:0.85rem; line-height:1.75; margin:0; }
        .proj-date  { display:inline-flex; align-items:center; gap:5px; font-family:var(--font-pixel,'Press Start 2P',monospace); font-size:0.4rem; letter-spacing:0.05em; padding:3px 8px; border-radius:999px; border:1px solid rgba(34,197,94,0.2); color:rgba(34,197,94,0.7); background:rgba(34,197,94,0.05); white-space:nowrap; }
        .action-btn { display:inline-flex; align-items:center; gap:6px; padding:0.5rem 1rem; border-radius:8px; font-family:var(--font-body,Syne,sans-serif); font-size:0.75rem; font-weight:700; letter-spacing:0.06em; text-transform:uppercase; text-decoration:none; cursor:pointer; transition:background 0.2s,box-shadow 0.2s,border-color 0.2s; border:1.5px solid; }
        .action-btn.primary { background:#22c55e; border-color:#22c55e; color:#090b0e; }
        .action-btn.primary:hover { background:transparent; color:#22c55e; box-shadow:0 0 16px rgba(34,197,94,0.3); }
        .action-btn.ghost   { background:transparent; border-color:rgba(34,197,94,0.3); }
        .action-btn.ghost:hover { border-color:#22c55e; background:rgba(34,197,94,0.08); box-shadow:0 0 12px rgba(34,197,94,0.15); }
        @keyframes projFadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        .proj-animate { animation:projFadeUp 0.55s ease forwards; opacity:0; }
      `}</style>

      <Link
        href={`/projects/${p._id}`}
        className="proj-card proj-animate"
        style={{
          background: cardBg,
          borderColor: cardBorder,
          animationDelay: `${index * 120}ms`,
        }}
      >
        <div className="cover-wrap">
          {p.cover ? (
            <Image
              src={p.cover}
              alt={p.title}
              fill
              sizes="(max-width:768px) 100vw, 50vw"
              className="proj-cover"
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                background: isDark
                  ? "rgba(255,255,255,0.04)"
                  : "rgba(0,0,0,0.04)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-pixel,'Press Start 2P',monospace)",
                  fontSize: "0.45rem",
                  color: "#22c55e",
                  opacity: 0.4,
                }}
              >
                no cover
              </span>
            </div>
          )}
          <div className="cover-overlay" />
        </div>

        <div
          style={{
            padding: "1.25rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
            flex: 1,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: "0.5rem",
              flexWrap: "wrap",
            }}
          >
            <h3 className="proj-title" style={{ color: textMain }}>
              {p.title}
            </h3>
            {p.date && (
              <span className="proj-date">
                <BsCalendar3 />
                {formatDate(p.date)}
              </span>
            )}
          </div>

          {p.tags && p.tags.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
              {p.tags.map((tag) => (
                <span
                  key={tag}
                  className={`proj-tag${highlightedTags.includes(tag) ? " highlighted" : ""}`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onTagClick?.(tag);
                  }}
                  style={{ cursor: onTagClick ? "pointer" : "default" }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {p.desc && (
            <p className="proj-desc" style={{ color: textMuted, flex: 1 }}>
              {p.desc}
            </p>
          )}
          <div style={{ height: "1px", background: cardBorder }} />

          <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
            {p.action1 && (
              <a
                href={p.action1.url}
                target="_blank"
                rel="noopener noreferrer"
                className="action-btn primary"
                onClick={(e) => e.stopPropagation()}
              >
                <BsBoxArrowUpRight style={{ fontSize: "0.75rem" }} />
                {p.action1.label}
              </a>
            )}
            {p.action2 && (
              <a
                href={p.action2.url}
                target="_blank"
                rel="noopener noreferrer"
                className="action-btn ghost"
                style={{ color: textMuted }}
                onClick={(e) => e.stopPropagation()}
              >
                <BsGithub style={{ fontSize: "0.85rem" }} />
                {p.action2.label}
              </a>
            )}
            {!p.action1 && !p.action2 && (
              <span
                style={{
                  fontFamily: "var(--font-body,Syne,sans-serif)",
                  fontSize: "0.72rem",
                  color: textMuted,
                  opacity: 0.5,
                }}
              >
                Private project
              </span>
            )}
          </div>
        </div>
      </Link>
    </>
  );
}
