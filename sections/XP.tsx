"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { BsCalendar3, BsArrowRight } from "react-icons/bs";

const PAD = "clamp(1rem, 8vw, 10rem)";

function formatDate(val: string): string {
  if (!val) return "Present";
  if (val.includes("T") || /^\d{4}-\d{2}-\d{2}/.test(val)) {
    return new Date(val).toLocaleString("default", {
      month: "short",
      year: "numeric",
    });
  }
  return val;
}

interface Props {
  data: any[];
}

export default function XP({ data }: Props) {
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
        .xp-card { position:relative; padding:1.5rem; border-radius:14px; border:1px solid; transition:transform 0.25s,box-shadow 0.25s,border-color 0.25s; }
        .xp-card:hover { transform:translateX(6px); box-shadow:0 8px 32px rgba(34,197,94,0.08); border-color:rgba(34,197,94,0.3) !important; }
        .xp-card-title  { font-family:var(--font-body,Syne,sans-serif); font-size:1rem; font-weight:700; letter-spacing:0.02em; margin:0 0 4px 0; }
        .xp-card-place  { font-family:var(--font-body,Syne,sans-serif); font-size:0.8rem; font-weight:600; color:#22c55e; letter-spacing:0.04em; }
        .xp-card-date   { display:inline-flex; align-items:center; justify-content:center; gap:6px; font-family:var(--font-body,Syne,sans-serif); font-size:0.72rem; font-weight:700; line-height:1; letter-spacing:0.04em; height:26px; padding:0 12px; border-radius:999px; border:1px solid rgba(34,197,94,0.4); color:#22c55e; background:rgba(34,197,94,0.1); white-space:nowrap; }
        .xp-card-desc   { font-family:var(--font-body,Syne,sans-serif); font-size:0.85rem; line-height:1.75; margin:0; }
        .xp-dot         { position:absolute; left:-1.85rem; top:1.6rem; width:12px; height:12px; border-radius:50%; background:#22c55e; box-shadow:0 0 10px rgba(34,197,94,0.6); flex-shrink:0; }
        @keyframes xpFadeIn { from{opacity:0;transform:translateX(-16px)} to{opacity:1;transform:translateX(0)} }
        .xp-animate { animation:xpFadeIn 0.5s ease forwards; opacity:0; }
        .section-label { font-family:var(--font-pixel,'Press Start 2P',monospace); font-size:0.5rem; letter-spacing:0.12em; text-transform:uppercase; color:#22c55e; opacity:0.8; }
        .section-title { font-family:var(--font-pixel,'Press Start 2P',monospace); line-height:1.5; margin:0; }
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
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            zIndex: 0,
            backgroundImage: isDark
              ? "repeating-linear-gradient(135deg,rgba(34,197,94,0.025) 0px,rgba(34,197,94,0.025) 1px,transparent 1px,transparent 48px)"
              : "repeating-linear-gradient(135deg,rgba(34,197,94,0.05) 0px,rgba(34,197,94,0.05) 1px,transparent 1px,transparent 48px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: "-10%",
            top: "20%",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle,rgba(34,197,94,0.06) 0%,transparent 70%)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        <div style={{ position: "relative", zIndex: 1 }}>
          <div
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.6s ease,transform 0.6s ease",
              marginBottom: "3rem",
            }}
          >
            <p className="section-label" style={{ marginBottom: "0.75rem" }}>
              Where I've been
            </p>
            <h2
              className="section-title"
              style={{ fontSize: "clamp(1rem,3vw,1.6rem)", color: textMain }}
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

          <div
            style={{
              position: "relative",
              paddingLeft: "2rem",
              opacity: visible ? 1 : 0,
              transition: "opacity 0.6s ease 0.2s",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: "5px",
                top: 0,
                bottom: 0,
                width: "2px",
                background: `linear-gradient(to bottom,#22c55e,${lineBg},transparent)`,
                borderRadius: "2px",
              }}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
              }}
            >
              {data.map((item, i) => (
                <div
                  key={item._id}
                  className="xp-animate"
                  style={{
                    animationDelay: `${i * 100}ms`,
                    position: "relative",
                  }}
                >
                  <div
                    className="xp-dot"
                    style={{ border: `2px solid ${dotBorder}` }}
                  />
                  <div
                    className="xp-card"
                    style={{ background: cardBg, borderColor: cardBorder }}
                  >
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
                      <span className="xp-card-date">
                        <BsCalendar3 style={{ fontSize: "0.6rem" }} />
                        {formatDate(item.start)}
                        <BsArrowRight
                          style={{ fontSize: "0.5rem", opacity: 0.6 }}
                        />
                        {item.end ? formatDate(item.end) : "Present"}
                      </span>
                    </div>
                    <div
                      style={{
                        height: "1px",
                        background: cardBorder,
                        marginBottom: "0.75rem",
                      }}
                    />
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
