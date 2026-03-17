"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import {
  SiHtml5,
  SiCss3,
  SiJavascript,
  SiTypescript,
  SiReact,
  SiNextdotjs,
  SiRedux,
  SiExpress,
  SiTailwindcss,
  SiSass,
  SiMongodb,
  SiRedis,
  SiAxios,
  SiGit,
  SiBlender,
  SiAdobeillustrator,
  SiPython,
  SiKotlin,
  SiLinux,
} from "react-icons/si";
import { RxComponent2 } from "react-icons/rx";
import {
  BsFilm,
  BsServer,
  BsCpuFill,
  BsDiagram3Fill,
  BsWifi,
  BsFiles,
} from "react-icons/bs";
import { FaGlobeAmericas } from "react-icons/fa";
import skill from "@/types/skill";
import { skills } from "@/public/data";

const PAD = "clamp(1rem, 8vw, 10rem)";

/* ── skill data ─────────────────────────────────────── */
type Section = "all" | "web" | "mobile" | "graphic" | "general" | "lang";

const TABS: { key: Section; label: string }[] = [
  { key: "all", label: "All" },
  { key: "web", label: "Web" },
  { key: "mobile", label: "Mobile" },
  { key: "graphic", label: "Graphic" },
  { key: "general", label: "General" },
  { key: "lang", label: "Languages" },
];

export default function Skills() {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState<Section>("all");
  const [visible, setVisible] = useState(false);

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
    const el = document.getElementById("skills-section");
    if (el) obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const current = theme === "system" ? systemTheme : theme;
  const isDark = mounted ? current === "dark" : true;

  const bg = isDark ? "#090b0e" : "#f8fafc";
  const textMain = isDark ? "#f8fafc" : "#090b0e";
  const textMuted = isDark ? "rgba(248,250,252,0.5)" : "rgba(9,11,14,0.5)";
  const cardBg = isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)";
  const cardBorder = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)";
  const cardHoverBg = isDark ? "rgba(34,197,94,0.06)" : "rgba(34,197,94,0.08)";
  const tabBg = isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)";
  const tabBorder = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";

  const filtered =
    active === "all" ? skills : skills.filter((s) => s.section === active);

  return (
    <>
      <style>{`
        /* Mobile-first: small cards, 5 per row */
        .skill-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 5px;
          padding: 0.65rem 0.3rem;
          border-radius: 10px;
          border: 1px solid;
          cursor: default;
          transition: transform 0.25s, box-shadow 0.25s, background 0.25s, border-color 0.25s;
          position: relative;
          overflow: hidden;
        }
        .skill-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 50% 0%, var(--skill-color-faint, transparent) 0%, transparent 70%);
          opacity: 0;
          transition: opacity 0.3s;
        }
        .skill-card:hover { transform: translateY(-4px); }
        .skill-card:hover::before { opacity: 1; }

        .skill-icon {
          font-size: 1.3rem;
          transition: transform 0.25s, filter 0.25s;
          line-height: 1;
        }
        .skill-card:hover .skill-icon {
          transform: scale(1.15);
          filter: drop-shadow(0 0 8px var(--skill-color, #22c55e));
        }

        .skill-title {
          font-family: var(--font-body, Syne, sans-serif);
          font-size: 0.55rem;
          font-weight: 700;
          letter-spacing: 0.02em;
          text-transform: uppercase;
          text-align: center;
          line-height: 1.2;
        }

        .skill-level {
          font-family: var(--font-pixel, 'Press Start 2P', monospace);
          font-size: 0.35rem;
          letter-spacing: 0.02em;
          padding: 2px 5px;
          border-radius: 999px;
          border: 1px solid rgba(34,197,94,0.3);
          color: #22c55e;
          background: rgba(34,197,94,0.08);
        }

        /* Desktop: larger cards */
        @media (min-width: 768px) {
          .skill-card { gap: 10px; padding: 1.4rem 1rem; border-radius: 14px; }
          .skill-icon  { font-size: 2rem; }
          .skill-title { font-size: 0.72rem; letter-spacing: 0.06em; }
          .skill-level { font-size: 0.42rem; padding: 3px 8px; }
        }

        .tab-btn {
          font-family: var(--font-body, Syne, sans-serif);
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          padding: 0.45rem 1.1rem;
          border-radius: 8px;
          border: 1px solid;
          cursor: pointer;
          transition: background 0.2s, color 0.2s, border-color 0.2s, box-shadow 0.2s;
          white-space: nowrap;
        }
        .tab-btn:hover {
          border-color: #22c55e !important;
          color: #22c55e !important;
        }
        .tab-btn.tab-active {
          background: #22c55e !important;
          border-color: #22c55e !important;
          color: #090b0e !important;
          box-shadow: 0 0 16px rgba(34,197,94,0.35);
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

        /* Mobile: 5 columns */
        .skills-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 0.5rem;
        }
        /* Desktop: auto-fill with min 110px */
        @media (min-width: 768px) {
          .skills-grid {
            grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
            gap: 1rem;
          }
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .card-animate {
          animation: fadeUp 0.5s ease forwards;
          opacity: 0;
        }
      `}</style>

      <section
        id="skills-section"
        style={{
          background: bg,
          paddingLeft: PAD,
          paddingRight: PAD,
          paddingTop: "6rem",
          paddingBottom: "6rem",
          transition: "background 0.3s",
        }}
      >
        {/* ── Header ───────────────────────────────────── */}
        <div
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
            marginBottom: "3rem",
          }}
        >
          <p className="section-label" style={{ marginBottom: "0.75rem" }}>
            What I know
          </p>
          <h2
            className="section-title"
            style={{
              fontSize: "clamp(1rem, 3vw, 1.6rem)",
              color: textMain,
            }}
          >
            Skills &amp; Tools
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

        {/* ── Filter tabs ──────────────────────────────── */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.6rem",
            marginBottom: "2.5rem",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.6s ease 0.15s, transform 0.6s ease 0.15s",
          }}
        >
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActive(key)}
              className={`tab-btn${active === key ? " tab-active" : ""}`}
              style={{
                background: active === key ? "#22c55e" : tabBg,
                borderColor: active === key ? "#22c55e" : tabBorder,
                color: active === key ? "#090b0e" : textMuted,
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ── Skills grid ──────────────────────────────── */}
        <div className="skills-grid">
          {filtered.map((skill, i) => (
            <div
              key={skill.title}
              className="skill-card card-animate"
              style={{
                background: cardBg,
                borderColor: cardBorder,
                animationDelay: `${i * 40}ms`,
                // @ts-ignore
                "--skill-color": skill.color,
                "--skill-color-faint": `${skill.color}22`,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.background =
                  cardHoverBg;
                (e.currentTarget as HTMLDivElement).style.borderColor =
                  `${skill.color}55`;
                (e.currentTarget as HTMLDivElement).style.boxShadow =
                  `0 8px 28px ${skill.color}22`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.background = cardBg;
                (e.currentTarget as HTMLDivElement).style.borderColor =
                  cardBorder;
                (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
              }}
            >
              {/* Icon */}
              <span
                className="skill-icon"
                style={{
                  color:
                    typeof skill.icon === "string" ? "#a0a0a0" : skill.color,
                }}
              >
                {skill.icon}
              </span>

              {/* Title */}
              <span className="skill-title" style={{ color: textMain }}>
                {skill.title}
              </span>

              {/* Level badge (only for lang section) */}
              {"level" in skill && skill.level && (
                <span className="skill-level">{skill.level as string}</span>
              )}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
