"use client";

import { useState, useMemo } from "react";
import { useTheme } from "next-themes";
import { useEffect } from "react";
import { BsSearch, BsX } from "react-icons/bs";
import Link from "next/link";
import ProjectCard from "@/components/ProjectCard";

const PAD = "clamp(1rem, 8vw, 10rem)";

interface Project {
  _id: string;
  title: string;
  desc?: string;
  date: string;
  cover?: string;
  tags?: string[];
  action1?: { label: string; url: string } | null;
  action2?: { label: string; url: string } | null;
}

interface Props {
  projects: Project[];
}

export default function ProjectsClient({ projects }: Props) {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [search, setSearch] = useState("");
  const [active, setActive] = useState<string[]>([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTimeout(() => setVisible(true), 80);
  }, []);

  const current = theme === "system" ? systemTheme : theme;
  const isDark = mounted ? current === "dark" : true;
  const bg = isDark ? "#090b0e" : "#f8fafc";
  const bgAlt = isDark ? "rgb(9,11,14)" : "#f1f5f9";
  const textMain = isDark ? "#f8fafc" : "#090b0e";
  const textMuted = isDark ? "rgba(248,250,252,0.5)" : "rgba(9,11,14,0.5)";
  const cardBg = isDark ? "rgba(255,255,255,0.03)" : "#ffffff";
  const cardBorder = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)";
  const inputBg = isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)";
  const inputBorder = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.1)";

  // Collect all unique tags across all projects
  const allTags = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => p.tags?.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [projects]);

  // Toggle a tag filter
  const toggleTag = (tag: string) => {
    setActive((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  // Filter projects by search + active tags
  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const matchSearch =
        !search.trim() ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.desc?.toLowerCase().includes(search.toLowerCase()) ||
        p.tags?.some((t) => t.toLowerCase().includes(search.toLowerCase()));

      const matchTags =
        active.length === 0 || active.every((t) => p.tags?.includes(t));

      return matchSearch && matchTags;
    });
  }, [projects, search, active]);

  const clearAll = () => {
    setSearch("");
    setActive([]);
  };
  const hasFilters = search.trim() || active.length > 0;

  return (
    <>
      <style>{`
        .proj-page-hero {
          position: relative;
          padding-top: 7rem;
          padding-bottom: 4rem;
          overflow: hidden;
        }
        .proj-page-hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            135deg,
            rgba(34,197,94,0.025) 0px, rgba(34,197,94,0.025) 1px,
            transparent 1px, transparent 48px
          );
          pointer-events: none;
        }
        .proj-page-hero::after {
          content: '';
          position: absolute;
          left: -10%;
          top: -20%;
          width: 500px;
          height: 500px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(34,197,94,0.07) 0%, transparent 70%);
          pointer-events: none;
        }

        /* Search input */
        .search-wrap {
          position: relative;
          flex: 1;
          min-width: 220px;
          max-width: 480px;
        }
        .search-input {
          width: 100%;
          height: 44px;
          padding: 0 2.75rem 0 2.75rem;
          border-radius: 10px;
          border: 1.5px solid;
          font-family: var(--font-body, Syne, sans-serif);
          font-size: 0.85rem;
          font-weight: 500;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          box-sizing: border-box;
        }
        .search-input:focus {
          border-color: #22c55e;
          box-shadow: 0 0 0 3px rgba(34,197,94,0.12);
        }
        .search-icon {
          position: absolute;
          left: 0.85rem;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
          color: #22c55e;
          opacity: 0.6;
          font-size: 0.9rem;
        }
        .search-clear {
          position: absolute;
          right: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0.5;
          transition: opacity 0.2s;
          font-size: 0.9rem;
        }
        .search-clear:hover { opacity: 1; }

        /* Tag filter pills */
        .tag-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 0.3rem 0.85rem;
          border-radius: 999px;
          font-family: var(--font-body, Syne, sans-serif);
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          cursor: pointer;
          border: 1.5px solid;
          transition: background 0.18s, border-color 0.18s, color 0.18s, box-shadow 0.18s;
          white-space: nowrap;
        }
        .tag-pill.active {
          background: #22c55e;
          border-color: #22c55e;
          color: #090b0e;
          box-shadow: 0 0 12px rgba(34,197,94,0.3);
        }
        .tag-pill:not(.active):hover {
          border-color: #22c55e;
          color: #22c55e;
        }

        /* Project card */
        .proj-card {
          border-radius: 16px;
          border: 1px solid;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: transform 0.3s, box-shadow 0.3s, border-color 0.3s;
        }
        .proj-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 48px rgba(34,197,94,0.1);
          border-color: rgba(34,197,94,0.3) !important;
        }
        .proj-cover {
          width: 100%;
          aspect-ratio: 16/9;
          object-fit: cover;
          display: block;
          transition: transform 0.4s;
          background: #0d1117;
        }
        .proj-card:hover .proj-cover { transform: scale(1.03); }
        .cover-wrap { overflow: hidden; position: relative; }
        .cover-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to bottom, transparent 50%, rgba(9,11,14,0.6) 100%);
          opacity: 0; transition: opacity 0.3s;
        }
        .proj-card:hover .cover-overlay { opacity: 1; }

        .proj-tag {
          font-family: var(--font-body, Syne, sans-serif);
          font-size: 0.62rem; font-weight: 700; letter-spacing: 0.05em;
          text-transform: uppercase; padding: 2px 9px; border-radius: 999px;
          border: 1px solid rgba(34,197,94,0.25); background: rgba(34,197,94,0.07);
          color: #22c55e; white-space: nowrap;
        }
        .proj-tag.highlighted {
          background: rgba(34,197,94,0.18);
          border-color: rgba(34,197,94,0.5);
        }
        .proj-title {
          font-family: var(--font-body, Syne, sans-serif);
          font-size: 1.05rem; font-weight: 700; letter-spacing: 0.02em; margin: 0;
        }
        .proj-desc {
          font-family: var(--font-body, Syne, sans-serif);
          font-size: 0.84rem; line-height: 1.75; margin: 0;
        }
        .proj-date {
          display: inline-flex; align-items: center; gap: 5px;
          font-family: var(--font-pixel, 'Press Start 2P', monospace);
          font-size: 0.38rem; letter-spacing: 0.05em;
          padding: 3px 8px; border-radius: 999px;
          border: 1px solid rgba(34,197,94,0.2);
          color: rgba(34,197,94,0.7); background: rgba(34,197,94,0.05);
        }
        .action-btn {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 0.45rem 0.9rem; border-radius: 8px;
          font-family: var(--font-body, Syne, sans-serif);
          font-size: 0.72rem; font-weight: 700; letter-spacing: 0.06em;
          text-transform: uppercase; text-decoration: none; cursor: pointer;
          transition: background 0.2s, box-shadow 0.2s, border-color 0.2s; border: 1.5px solid;
        }
        .action-btn.primary { background: #22c55e; border-color: #22c55e; color: #090b0e; }
        .action-btn.primary:hover { background: transparent; color: #22c55e; box-shadow: 0 0 14px rgba(34,197,94,0.3); }
        .action-btn.ghost  { background: transparent; border-color: rgba(34,197,94,0.3); }
        .action-btn.ghost:hover  { border-color: #22c55e; background: rgba(34,197,94,0.08); }

        /* Results count */
        .results-label {
          font-family: var(--font-pixel, 'Press Start 2P', monospace);
          font-size: 0.42rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #22c55e;
          opacity: 0.7;
        }

        /* Clear filters btn */
        .clear-btn {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 0.3rem 0.85rem; border-radius: 999px;
          font-family: var(--font-body, Syne, sans-serif);
          font-size: 0.7rem; font-weight: 700; letter-spacing: 0.05em;
          text-transform: uppercase; cursor: pointer;
          border: 1.5px solid rgba(239,68,68,0.3);
          background: rgba(239,68,68,0.06);
          color: rgb(239,68,68);
          transition: background 0.18s, border-color 0.18s;
        }
        .clear-btn:hover { background: rgba(239,68,68,0.12); border-color: rgba(239,68,68,0.5); }

        /* No results */
        .no-results {
          text-align: center;
          padding: 5rem 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        /* Grid */
        .projects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(min(100%, 340px), 1fr));
          gap: 1.5rem;
        }

        /* Section header */
        .section-label { font-family:var(--font-pixel,'Press Start 2P',monospace); font-size:0.5rem; letter-spacing:0.12em; text-transform:uppercase; color:#22c55e; opacity:0.8; }
        .section-title { font-family:var(--font-pixel,'Press Start 2P',monospace); line-height:1.5; margin:0; }

        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .fade-up { animation: fadeUp 0.5s ease forwards; opacity: 0; }
        @keyframes cardIn { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        .card-in { animation: cardIn 0.45s ease forwards; opacity: 0; }
      `}</style>

      {/* ── Hero header ─────────────────────────────────────────── */}
      <div
        className="proj-page-hero"
        style={{
          background: bg,
          paddingLeft: PAD,
          paddingRight: PAD,
          transition: "background 0.3s",
        }}
      >
        <div style={{ position: "relative", zIndex: 1 }}>
          <div
            className={visible ? "fade-up" : ""}
            style={{ opacity: visible ? undefined : 0 }}
          >
            <p className="section-label" style={{ marginBottom: "0.75rem" }}>
              What I've built
            </p>
            <h1
              className="section-title"
              style={{ fontSize: "clamp(1.2rem, 4vw, 2rem)", color: textMain }}
            >
              All Projects
            </h1>
            <div
              style={{
                marginTop: "1rem",
                width: "48px",
                height: "3px",
                background: "#22c55e",
                borderRadius: "2px",
                boxShadow: "0 0 10px rgba(34,197,94,0.5)",
              }}
            />
            <p
              style={{
                marginTop: "1.25rem",
                fontFamily: "var(--font-body, Syne, sans-serif)",
                fontSize: "0.9rem",
                color: textMuted,
                maxWidth: "460px",
                lineHeight: 1.7,
              }}
            >
              A collection of {projects.length} projects — from quick
              experiments to full production systems.
            </p>
          </div>
        </div>
      </div>

      {/* ── Search + Filters ────────────────────────────────────── */}
      <div
        style={{
          background: bgAlt,
          borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)"}`,
          borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)"}`,
          paddingLeft: PAD,
          paddingRight: PAD,
          paddingTop: "1.75rem",
          paddingBottom: "1.75rem",
          transition: "background 0.3s",
        }}
      >
        {/* Search row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            flexWrap: "wrap",
            marginBottom: "1.25rem",
          }}
        >
          <div className="search-wrap">
            <BsSearch className="search-icon" />
            <input
              className="search-input"
              type="text"
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                background: inputBg,
                borderColor: inputBorder,
                color: textMain,
              }}
            />
            {search && (
              <button
                className="search-clear"
                style={{ color: textMain }}
                onClick={() => setSearch("")}
              >
                <BsX />
              </button>
            )}
          </div>

          {hasFilters && (
            <button className="clear-btn" onClick={clearAll}>
              <BsX style={{ fontSize: "0.8rem" }} /> Clear all
            </button>
          )}
        </div>

        {/* Tag filters */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.5rem",
            alignItems: "center",
          }}
        >
          {allTags.map((tag) => (
            <button
              key={tag}
              className={`tag-pill${active.includes(tag) ? " active" : ""}`}
              onClick={() => toggleTag(tag)}
              style={{
                background: active.includes(tag) ? "#22c55e" : inputBg,
                borderColor: active.includes(tag) ? "#22c55e" : inputBorder,
                color: active.includes(tag) ? "#090b0e" : textMuted,
              }}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* ── Projects grid ───────────────────────────────────────── */}
      <div
        style={{
          background: bg,
          paddingLeft: PAD,
          paddingRight: PAD,
          paddingTop: "3rem",
          paddingBottom: "6rem",
          transition: "background 0.3s",
        }}
      >
        {/* Results count */}
        <div
          style={{
            marginBottom: "1.75rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "0.5rem",
          }}
        >
          <span className="results-label">
            {filtered.length} {filtered.length === 1 ? "project" : "projects"}{" "}
            found
          </span>
          {hasFilters && (
            <span
              style={{
                fontFamily: "var(--font-body, Syne, sans-serif)",
                fontSize: "0.75rem",
                color: textMuted,
              }}
            >
              filtered from {projects.length} total
            </span>
          )}
        </div>

        {/* No results */}
        {filtered.length === 0 && (
          <div className="no-results">
            <span
              style={{
                fontFamily: "var(--font-pixel, 'Press Start 2P', monospace)",
                fontSize: "0.6rem",
                color: "#22c55e",
                opacity: 0.5,
              }}
            >
              // 404
            </span>
            <p
              style={{
                fontFamily: "var(--font-body, Syne, sans-serif)",
                fontSize: "1rem",
                fontWeight: 700,
                color: textMain,
                margin: 0,
              }}
            >
              No projects match your search
            </p>
            <p
              style={{
                fontFamily: "var(--font-body, Syne, sans-serif)",
                fontSize: "0.85rem",
                color: textMuted,
                margin: 0,
              }}
            >
              Try adjusting your filters or search term
            </p>
            <button
              className="clear-btn"
              onClick={clearAll}
              style={{ marginTop: "0.5rem" }}
            >
              <BsX style={{ fontSize: "0.8rem" }} /> Clear filters
            </button>
          </div>
        )}

        {/* Grid */}
        <div className="projects-grid">
          {filtered.map((p, i) => (
            <ProjectCard
              key={p._id}
              project={p}
              index={i}
              cardBg={cardBg}
              cardBorder={cardBorder}
              textMain={textMain}
              textMuted={textMuted}
              isDark={isDark}
              highlightedTags={active}
              onTagClick={toggleTag}
            />
          ))}
        </div>
      </div>
    </>
  );
}
