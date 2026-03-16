"use client";

import { useEffect, useState, useRef } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";
import {
  BsCalendar3,
  BsArrowRight,
  BsGithub,
  BsBoxArrowUpRight,
} from "react-icons/bs";

const PAD = "clamp(1rem, 8vw, 10rem)";

interface Project {
  title: string;
  desc: string;
  date: string;
  cover: string;
  tags: string[];
  action1: { label: string; url: string } | null;
  action2: { label: string; url: string } | null;
}

const projects: Project[] = [
  {
    title: "Gericht restaurant",
    desc: "A fully responsive restaurant website. Features a modern landing page, Designed with a clean and appetizing UI optimized for all screen sizes.",
    date: "2023-03",
    cover: "restaurant.png",
    tags: ["react", "plain", "css", "JavaScript"],
    action1: { label: "Live", url: "https://abodesalm.github.io/restaurant" },
    action2: {
      label: "GitHub",
      url: "https://github.com/abodesalm/restaurant",
    },
  },
  {
    title: "Coffee shop website",
    desc: "A landing page for a coffee office supply service. Features service listings, FAQ accordion, and a contact section. Clean single-page layout with smooth anchor navigation.",
    date: "2024-06",
    cover: "coffee.png",
    tags: ["NextJS", "SASS", "TypeScript", "TailwindCSS"],
    action1: { label: "Live", url: "https://abod-coffee.netlify.app/" },
    action2: { label: "GitHub", url: "https://github.com/abodesalm/coffee" },
  },
  {
    title: "Telcom website",
    desc: "An internal management system built for Telcom Internet Company. Shows the available internet packs, and the contacts.",
    date: "2026-02",
    cover: "telcom.png",
    tags: ["React", "TailwindCSS", "", "", ""],
    action1: { label: "Live", url: "https://tellcom.netlify.app/" },
    action2: null,
  },
];

export default function Projects() {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setVisible(true);
      },
      { threshold: 0.1 },
    );
    const el = document.getElementById("projects-section");
    if (el) obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const current = theme === "system" ? systemTheme : theme;
  const isDark = mounted ? current === "dark" : true;

  /* ── floating particles canvas ─────────────── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.parentElement?.offsetWidth ?? window.innerWidth;
      canvas.height = canvas.parentElement?.offsetHeight ?? window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    type Particle = {
      x: number;
      y: number;
      r: number;
      speed: number;
      opacity: number;
      drift: number;
    };

    // spawn only in bottom 50% so top half is always clear
    const spawnY = () =>
      canvas.height * 0.5 + Math.random() * canvas.height * 0.5;

    const particles: Particle[] = Array.from({ length: 38 }, () => ({
      x: Math.random() * canvas.width,
      y: spawnY(),
      r: Math.random() * 1.8 + 0.4,
      speed: Math.random() * 0.4 + 0.15,
      opacity: Math.random() * 0.35 + 0.08,
      drift: (Math.random() - 0.5) * 0.3,
    }));

    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const half = canvas.height * 0.5; // below this: visible
      const fadeStart = canvas.height * 0.75; // below this: start fading
      particles.forEach((p) => {
        // only draw in bottom half
        if (p.y >= half) {
          const fadeAlpha =
            p.y > fadeStart
              ? p.opacity * (1 - (p.y - fadeStart) / (canvas.height * 0.25))
              : p.opacity;
          if (fadeAlpha > 0) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(34,197,94,${Math.max(0, fadeAlpha)})`;
            ctx.fill();
          }
        }
        p.y -= p.speed;
        p.x += p.drift;
        // when particle leaves top half, reset to bottom
        if (p.y < half) {
          p.y = spawnY();
          p.x = Math.random() * canvas.width;
        }
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [isDark]);

  const bg = isDark ? "rgb(9,11,14)" : "#f1f5f9";
  const textMain = isDark ? "#f8fafc" : "#090b0e";
  const textMuted = isDark ? "rgba(248,250,252,0.5)" : "rgba(9,11,14,0.5)";
  const cardBg = isDark ? "rgba(255,255,255,0.03)" : "#ffffff";
  const cardBorder = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)";

  const formatDate = (d: string) => {
    const [y, m] = d.split("-");
    return `${new Date(`${y}-${m}-01`).toLocaleString("default", { month: "short" })} ${y}`;
  };

  return (
    <>
      <style>{`
        .project-card {
          border-radius: 16px;
          border: 1px solid;
          overflow: hidden;
          transition: transform 0.3s, box-shadow 0.3s, border-color 0.3s;
          display: flex;
          flex-direction: column;
        }
        .project-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 48px rgba(34,197,94,0.1);
          border-color: rgba(34,197,94,0.3) !important;
        }

        .project-cover {
          width: 100%;
          aspect-ratio: 16/9;
          object-fit: cover;
          display: block;
          transition: transform 0.4s;
          background: #0d1117;
        }
        .project-card:hover .project-cover { transform: scale(1.03); }

        .cover-wrapper {
          overflow: hidden;
          position: relative;
        }
        .cover-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, transparent 50%, rgba(9,11,14,0.7) 100%);
          opacity: 0;
          transition: opacity 0.3s;
        }
        .project-card:hover .cover-overlay { opacity: 1; }

        .project-tag {
          font-family: var(--font-body, Syne, sans-serif);
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          padding: 3px 10px;
          border-radius: 999px;
          border: 1px solid rgba(34,197,94,0.25);
          background: rgba(34,197,94,0.07);
          color: #22c55e;
          white-space: nowrap;
        }

        .project-title {
          font-family: var(--font-body, Syne, sans-serif);
          font-size: 1.1rem;
          font-weight: 700;
          letter-spacing: 0.02em;
          margin: 0;
        }

        .project-desc {
          font-family: var(--font-body, Syne, sans-serif);
          font-size: 0.85rem;
          line-height: 1.75;
          margin: 0;
        }

        .project-date {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-family: var(--font-pixel, 'Press Start 2P', monospace);
          font-size: 0.4rem;
          letter-spacing: 0.05em;
          padding: 3px 8px;
          border-radius: 999px;
          border: 1px solid rgba(34,197,94,0.2);
          color: rgba(34,197,94,0.7);
          background: rgba(34,197,94,0.05);
        }

        .action-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-family: var(--font-body, Syne, sans-serif);
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          text-decoration: none;
          cursor: pointer;
          transition: background 0.2s, box-shadow 0.2s, transform 0.2s, border-color 0.2s;
          border: 1.5px solid;
        }
        .action-btn.primary {
          background: #22c55e;
          border-color: #22c55e;
          color: #090b0e;
        }
        .action-btn.primary:hover {
          background: transparent;
          color: #22c55e;
          box-shadow: 0 0 16px rgba(34,197,94,0.3);
        }
        .action-btn.ghost {
          background: transparent;
          border-color: rgba(34,197,94,0.3);
        }
        .action-btn.ghost:hover {
          border-color: #22c55e;
          background: rgba(34,197,94,0.08);
          box-shadow: 0 0 12px rgba(34,197,94,0.15);
        }

        .show-more-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 0.75rem 2rem;
          border-radius: 10px;
          border: 1.5px solid rgba(34,197,94,0.4);
          background: transparent;
          font-family: var(--font-body, Syne, sans-serif);
          font-size: 0.85rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          text-decoration: none;
          transition: background 0.2s, border-color 0.2s, box-shadow 0.2s, transform 0.2s;
        }
        .show-more-btn:hover {
          background: rgba(34,197,94,0.08);
          border-color: #22c55e;
          box-shadow: 0 0 24px rgba(34,197,94,0.2);
          transform: translateY(-2px);
        }

        @keyframes projFadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .proj-animate {
          animation: projFadeUp 0.55s ease forwards;
          opacity: 0;
        }

        .section-label {
          font-family: var(--font-pixel, 'Press Start 2P', monospace);
          font-size: 0.5rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #22c55e;
          opacity: 0.8;
        }
        .section-title {
          font-family: var(--font-pixel, 'Press Start 2P', monospace);
          line-height: 1.5;
          margin: 0;
        }
      `}</style>

      <section
        id="projects-section"
        style={{
          position: "relative",
          background: bg,
          paddingLeft: PAD,
          paddingRight: PAD,
          paddingTop: "6rem",
          paddingBottom: "6rem",
          transition: "background 0.3s",
          overflow: "hidden",
        }}
      >
        {/* ── Floating particles canvas ───────────── */}
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        {/* ── Content ──────────────────────────────── */}
        <div style={{ position: "relative", zIndex: 1 }}>
          {/* Header */}
          <div
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.6s ease, transform 0.6s ease",
              marginBottom: "3rem",
            }}
          >
            <div>
              <p className="section-label" style={{ marginBottom: "0.75rem" }}>
                What I've built
              </p>
              <h2
                className="section-title"
                style={{
                  fontSize: "clamp(1rem, 3vw, 1.6rem)",
                  color: textMain,
                }}
              >
                Projects
              </h2>
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
            </div>
          </div>

          {/* Cards grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fill, minmax(min(100%, 340px), 1fr))",
              gap: "1.5rem",
              marginBottom: "3rem",
            }}
          >
            {projects.map((p, i) => (
              <div
                key={p.title}
                className="project-card proj-animate"
                style={{
                  background: cardBg,
                  borderColor: cardBorder,
                  animationDelay: `${i * 120}ms`,
                }}
              >
                {/* Cover */}
                <div className="cover-wrapper">
                  <img
                    src={`/img/covers/${p.cover}`}
                    alt={p.title}
                    className="project-cover"
                  />
                  <div className="cover-overlay" />
                </div>

                {/* Body */}
                <div
                  style={{
                    padding: "1.25rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.75rem",
                    flex: 1,
                  }}
                >
                  {/* Title + date row */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      gap: "0.5rem",
                      flexWrap: "wrap",
                    }}
                  >
                    <h3 className="project-title" style={{ color: textMain }}>
                      {p.title}
                    </h3>
                    <span className="project-date">
                      <BsCalendar3 />
                      {formatDate(p.date)}
                    </span>
                  </div>

                  {/* Tags */}
                  <div
                    style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}
                  >
                    {p.tags.map((tag) => (
                      <span key={tag} className="project-tag">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Desc */}
                  <p
                    className="project-desc"
                    style={{ color: textMuted, flex: 1 }}
                  >
                    {p.desc}
                  </p>

                  {/* Divider */}
                  <div style={{ height: "1px", background: cardBorder }} />

                  {/* Actions */}
                  <div
                    style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}
                  >
                    {p.action1 && (
                      <a
                        href={p.action1.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="action-btn primary"
                      >
                        <BsBoxArrowUpRight style={{ fontSize: "0.8rem" }} />
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
                      >
                        <BsGithub style={{ fontSize: "0.9rem" }} />
                        {p.action2.label}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Show more — centered below cards */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Link
              href="/projects"
              className="show-more-btn"
              style={{ color: textMuted }}
            >
              Show All Projects
              <BsArrowRight style={{ fontSize: "0.9rem" }} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
