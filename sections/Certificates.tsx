"use client";

import { useEffect, useState, useRef } from "react";
import { useTheme } from "next-themes";
import { BsCalendar3, BsPatchCheckFill, BsAwardFill } from "react-icons/bs";
import { certs } from "@/public/data";

const PAD = "clamp(1rem, 8vw, 10rem)";

const formatDate = (d: string) => {
  const [y, m] = d.split("-");
  return `${new Date(`${y}-${m}-01`).toLocaleString("default", { month: "short" })} ${y}`;
};

export default function Certificates() {
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
    const el = document.getElementById("certs-section");
    if (el) obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const current = theme === "system" ? systemTheme : theme;
  const isDark = mounted ? current === "dark" : true;

  /* ── floating particles canvas ───────────────── */
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

    const particles: Particle[] = Array.from({ length: 38 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.8 + 0.4,
      speed: Math.random() * 0.4 + 0.15,
      opacity: Math.random() * 0.35 + 0.08,
      drift: (Math.random() - 0.5) * 0.3,
    }));

    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(34,197,94,${p.opacity})`;
        ctx.fill();
        p.y -= p.speed;
        p.x += p.drift;
        if (p.y < -10) {
          p.y = canvas.height + 10;
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

  const bg = isDark ? "rgb(9,11,14)" : "#f8fafc";
  const textMain = isDark ? "#f8fafc" : "#090b0e";
  const textMuted = isDark ? "rgba(248,250,252,0.5)" : "rgba(9,11,14,0.5)";
  const cardBg = isDark ? "rgba(255,255,255,0.03)" : "#ffffff";
  const cardBorder = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)";

  return (
    <>
      <style>{`
        .cert-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.25rem 1.5rem;
          border-radius: 14px;
          border: 1px solid;
          transition: transform 0.25s, box-shadow 0.25s, border-color 0.25s;
        }
        .cert-card:hover {
          transform: translateX(6px);
          box-shadow: 0 8px 32px rgba(34,197,94,0.08);
          border-color: rgba(34,197,94,0.3) !important;
        }
        .cert-icon-wrap {
          width: 44px; height: 44px;
          border-radius: 12px;
          border: 1.5px solid rgba(34,197,94,0.3);
          background: rgba(34,197,94,0.07);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          transition: background 0.25s, box-shadow 0.25s;
        }
        .cert-card:hover .cert-icon-wrap {
          background: rgba(34,197,94,0.14);
          box-shadow: 0 0 14px rgba(34,197,94,0.3);
        }
        .cert-title {
          font-family: var(--font-body, Syne, sans-serif);
          font-size: 0.92rem;
          font-weight: 700;
          letter-spacing: 0.01em;
          margin: 0 0 6px 0;
          line-height: 1.3;
        }
        .cert-meta {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          flex-wrap: wrap;
        }
        .cert-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          font-family: var(--font-pixel, 'Press Start 2P', monospace);
          font-size: 0.5rem;
          font-weight: 700;
          line-height: 1;
          letter-spacing: 0.04em;
          padding: 0 8px;
          height: 20px;
          border-radius: 999px;
          white-space: nowrap;
        }
        .cert-badge.date {
          border: 1px solid rgba(34,197,94,0.2);
          color: rgba(34,197,94,0.75);
          background: rgba(34,197,94,0.06);
        }
        .cert-badge.score {
          border: 1px solid rgba(251,191,36,0.3);
          color: #fbbf24;
          background: rgba(251,191,36,0.07);
        }
        @keyframes certFadeIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .cert-animate {
          animation: certFadeIn 0.45s ease forwards;
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
        id="certs-section"
        style={{
          position: "relative",
          background: bg,
          paddingLeft: PAD,
          paddingRight: PAD,
          paddingTop: "6rem",
          paddingBottom: "6rem",
          transition: "background 0.3s",
        }}
      >
        {/* ── Floating particles canvas ─────────── */}
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

        {/* ── Corner glow top-right ─────────────── */}
        <div
          style={{
            position: "absolute",
            top: "-40px",
            right: "2%",
            width: "280px",
            height: "280px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(34,197,94,0.07) 0%, transparent 70%)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        {/* ── Horizontal scan line ──────────────── */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: "50%",
            height: "1px",
            background: isDark
              ? "linear-gradient(to right, transparent, rgba(34,197,94,0.08), transparent)"
              : "linear-gradient(to right, transparent, rgba(34,197,94,0.14), transparent)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        {/* ── Content ──────────────────────────── */}
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
              What I've earned
            </p>
            <h2
              className="section-title"
              style={{ fontSize: "clamp(1rem, 3vw, 1.6rem)", color: textMain }}
            >
              Certificates
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

          {/* Cards grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fill, minmax(min(100%, 480px), 1fr))",
              gap: "1rem",
              opacity: visible ? 1 : 0,
              transition: "opacity 0.5s ease 0.2s",
            }}
          >
            {certs.map((c, i) => (
              <div
                key={c.title}
                className="cert-card cert-animate"
                style={{
                  background: cardBg,
                  borderColor: cardBorder,
                  animationDelay: `${i * 80}ms`,
                }}
              >
                {/* Icon */}
                <div className="cert-icon-wrap">
                  <BsAwardFill
                    style={{ fontSize: "1.2rem", color: "#22c55e" }}
                  />
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 className="cert-title" style={{ color: textMain }}>
                    {c.title}
                  </h3>
                  <div className="cert-meta">
                    <span className="cert-badge date">
                      <BsCalendar3 style={{ fontSize: "0.7rem" }} />
                      {c.date}
                    </span>
                    {c.score && (
                      <span className="cert-badge score">
                        <BsPatchCheckFill style={{ fontSize: "0.7rem" }} />
                        {c.score}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
