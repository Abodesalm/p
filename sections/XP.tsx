"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import {
  BsBriefcaseFill,
  BsBookFill,
  BsCalendar3,
  BsArrowRight,
} from "react-icons/bs";

const PAD = "clamp(1rem, 8vw, 10rem)";

type XPType = "job" | "education";

interface XPItem {
  title: string;
  place: string;
  start: string;
  end: string;
  desc: string;
  type: XPType;
}

const xpData: XPItem[] = [
  {
    title: "Freelancer",
    place: "Self-employed",
    start: "Nov 2022",
    end: "Present",
    desc: "Developed and designed websites, branding materials, and offered training for clients. Recognized within the freelance and content creators' community for strong technical support and creative solutions.",
    type: "job",
  },
  {
    title: "Programming Team Leader",
    place: "MYTE — Saudi Arabia",
    start: "Jun 2023",
    end: "Apr 2024",
    desc: "Led the programming department of MYTE, a Saudi digital services company. Successfully improved project turnaround time and delivery quality before the company was shut down for legal reasons.",
    type: "job",
  },
  {
    title: "Front-End Web Developer",
    place: "Virgo",
    start: "Nov 2024",
    end: "Feb 2025",
    desc: "Worked on the front-end development of a Hajj and Umrah software system. Developed the UI using modern technologies, although the project was later discontinued.",
    type: "job",
  },
  {
    title: "Games Designer",
    place: "Indie Projects",
    start: "Jun 2024",
    end: "Mar 2025",
    desc: "Designed documentation and game concepts for indie game developers. Handed over responsibilities due to external commitments.",
    type: "job",
  },
  {
    title: "Podcast Founder",
    place: "Muallak",
    start: "Jul 2025",
    end: "Present",
    desc: "Founded the podcast from scratch and managed everything related to it; recording, video editing, designing and marketing.",
    type: "job",
  },
  {
    title: "Storekeeper & IT Specialist",
    place: "Telcom Internet Company",
    start: "Aug 2025",
    end: "Nov 2025",
    desc: "Worked as storekeeper and IT specialist simultaneously. Managed storage and started developing an internal management system, also helped setting up some of their servers.",
    type: "job",
  },
  {
    title: "IT Specialist",
    place: "Telcom Internet Company",
    start: "Nov 2025",
    end: "Jan 2026",
    desc: "Continued developing the system remotely from home while studying in another city. Completed and set up the full system for the company.",
    type: "job",
  },
];

export default function XP() {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
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
    const el = document.getElementById("xp-section");
    if (el) obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const current = theme === "system" ? systemTheme : theme;
  const isDark = mounted ? current === "dark" : true;

  const bg = isDark ? "#090b0e" : "#f8fafc";
  const textMain = isDark ? "#f8fafc" : "#090b0e";
  const textMuted = isDark ? "rgba(248,250,252,0.6)" : "rgba(9,11,14,0.6)";
  const cardBg = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)";
  const cardBorder = isDark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.08)";
  const lineBg = isDark ? "rgba(34,197,94,0.15)" : "rgba(34,197,94,0.2)";
  const dotBorder = isDark ? "#090b0e" : "#f8fafc";

  return (
    <>
      <style>{`
        .xp-card {
          position: relative;
          padding: 1.5rem;
          border-radius: 14px;
          border: 1px solid;
          transition: transform 0.25s, box-shadow 0.25s, border-color 0.25s;
        }
        .xp-card:hover {
          transform: translateX(6px);
          box-shadow: 0 8px 32px rgba(34,197,94,0.08);
          border-color: rgba(34,197,94,0.3) !important;
        }
        .xp-card-title {
          font-family: var(--font-body, Syne, sans-serif);
          font-size: 1rem;
          font-weight: 700;
          letter-spacing: 0.02em;
          margin: 0 0 4px 0;
        }
        .xp-card-place {
          font-family: var(--font-body, Syne, sans-serif);
          font-size: 0.8rem;
          font-weight: 600;
          color: #22c55e;
          letter-spacing: 0.04em;
        }
        .xp-card-date {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          font-family: var(--font-body, Syne, sans-serif);
          font-size: 0.72rem;
          font-weight: 700;
          line-height: 1;
          letter-spacing: 0.04em;
          height: 26px;
          padding: 0 12px;
          border-radius: 999px;
          border: 1px solid rgba(34,197,94,0.4);
          color: #22c55e;
          background: rgba(34,197,94,0.1);
          white-space: nowrap;
        }
        .xp-card-desc {
          font-family: var(--font-body, Syne, sans-serif);
          font-size: 0.85rem;
          line-height: 1.75;
          margin: 0;
        }
        .xp-type-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          font-family: var(--font-body, Syne, sans-serif);
          font-size: 0.65rem;
          font-weight: 700;
          line-height: 1;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          height: 24px;
          padding: 0 10px;
          border-radius: 999px;
        }
        .xp-dot {
          position: absolute;
          left: -1.85rem;
          top: 1.6rem;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #22c55e;
          box-shadow: 0 0 10px rgba(34,197,94,0.6);
          flex-shrink: 0;
        }
        @keyframes xpFadeIn {
          from { opacity: 0; transform: translateX(-16px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .xp-animate {
          animation: xpFadeIn 0.5s ease forwards;
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
        id="xp-section"
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
        {/* ── Diagonal line texture ─────────────────── */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            zIndex: 0,
            backgroundImage: isDark
              ? "repeating-linear-gradient(135deg, rgba(34,197,94,0.025) 0px, rgba(34,197,94,0.025) 1px, transparent 1px, transparent 48px)"
              : "repeating-linear-gradient(135deg, rgba(34,197,94,0.05) 0px, rgba(34,197,94,0.05) 1px, transparent 1px, transparent 48px)",
          }}
        />

        {/* ── Right side glow blob ──────────────────── */}
        <div
          style={{
            position: "absolute",
            right: "-10%",
            top: "20%",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(34,197,94,0.06) 0%, transparent 70%)",
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
            <p className="section-label" style={{ marginBottom: "0.75rem" }}>
              Where I've been
            </p>
            <h2
              className="section-title"
              style={{ fontSize: "clamp(1rem, 3vw, 1.6rem)", color: textMain }}
            >
              Experience
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

          {/* Timeline */}
          <div
            style={{
              position: "relative",
              paddingLeft: "2rem",
              opacity: visible ? 1 : 0,
              transition: "opacity 0.6s ease 0.2s",
            }}
          >
            {/* Vertical line */}
            <div
              style={{
                position: "absolute",
                left: "5px",
                top: 0,
                bottom: 0,
                width: "2px",
                background: `linear-gradient(to bottom, #22c55e, ${lineBg}, transparent)`,
                borderRadius: "2px",
              }}
            />

            {/* Cards */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
              }}
            >
              {xpData.map((item, i) => (
                <div
                  key={`${item.title}-${i}`}
                  className="xp-animate"
                  style={{
                    animationDelay: `${i * 100}ms`,
                    position: "relative",
                  }}
                >
                  {/* Timeline dot */}
                  <div
                    className="xp-dot"
                    style={{ border: `2px solid ${dotBorder}` }}
                  />

                  <div
                    className="xp-card"
                    style={{ background: cardBg, borderColor: cardBorder }}
                  >
                    {/* Top row */}
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        gap: "0.75rem",
                        marginBottom: "0.75rem",
                      }}
                    >
                      <div>
                        <h3
                          className="xp-card-title"
                          style={{ color: textMain }}
                        >
                          {item.title}
                        </h3>
                        <span className="xp-card-place">{item.place}</span>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-end",
                          gap: "6px",
                        }}
                      >
                        {/* Date */}
                        <span className="xp-card-date">
                          <BsCalendar3 style={{ fontSize: "0.6rem" }} />
                          {item.start}
                          <BsArrowRight
                            style={{ fontSize: "0.5rem", opacity: 0.6 }}
                          />
                          {item.end}
                        </span>
                        {/* Type badge */}
                        <span
                          className="xp-type-badge"
                          style={{
                            background:
                              item.type === "job"
                                ? "rgba(34,197,94,0.1)"
                                : "rgba(99,102,241,0.1)",
                            border: `1px solid ${item.type === "job" ? "rgba(34,197,94,0.3)" : "rgba(99,102,241,0.3)"}`,
                            color: item.type === "job" ? "#22c55e" : "#818cf8",
                          }}
                        >
                          {item.type === "job" ? (
                            <BsBriefcaseFill style={{ fontSize: "0.6rem" }} />
                          ) : (
                            <BsBookFill style={{ fontSize: "0.6rem" }} />
                          )}
                          {item.type === "job" ? "Work" : "Education"}
                        </span>
                      </div>
                    </div>

                    {/* Divider */}
                    <div
                      style={{
                        height: "1px",
                        background: cardBorder,
                        marginBottom: "0.75rem",
                      }}
                    />

                    {/* Description */}
                    <p className="xp-card-desc" style={{ color: textMuted }}>
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
