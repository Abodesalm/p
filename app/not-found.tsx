"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Terminal } from "lucide-react";

export default function NotFound() {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTimeout(() => setVisible(true), 100);
  }, []);

  const current = theme === "system" ? systemTheme : theme;
  const isDark = mounted ? current === "dark" : true;
  const bg = isDark ? "#090b0e" : "#f8fafc";
  const textMain = isDark ? "#f8fafc" : "#090b0e";
  const textMuted = isDark ? "rgba(248,250,252,0.45)" : "rgba(9,11,14,0.45)";

  return (
    <>
      <style>{`
        @keyframes gridPulse { 0%,100%{opacity:0.5} 50%{opacity:1} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        .nf-fade { opacity:0; animation: fadeUp 0.7s ease forwards; }
        .nf-fade-1 { animation-delay: 0.1s; }
        .nf-fade-2 { animation-delay: 0.25s; }
        .nf-fade-3 { animation-delay: 0.4s; }
        .nf-btn {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 0.75rem 1.75rem; border-radius: 10px;
          border: 1.5px solid rgba(34,197,94,0.4); background: transparent;
          font-family: var(--font-body,Syne,sans-serif); font-weight: 700;
          font-size: 0.85rem; letter-spacing: 0.06em; text-transform: uppercase;
          text-decoration: none; cursor: pointer;
          transition: background 0.2s, border-color 0.2s, box-shadow 0.2s, transform 0.2s;
        }
        .nf-btn:hover {
          background: rgba(34,197,94,0.08); border-color: #22c55e;
          box-shadow: 0 0 20px rgba(34,197,94,0.2); transform: translateY(-2px);
        }
        .cursor { display:inline-block; width:3px; height:1.1em; background:#22c55e; margin-left:4px; vertical-align:middle; animation:blink 1s step-end infinite; }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          background: bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          transition: "background 0.3s",
        }}
      >
        {/* Grid background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: isDark
              ? "linear-gradient(rgba(34,197,94,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(34,197,94,0.04) 1px,transparent 1px)"
              : "linear-gradient(rgba(34,197,94,0.07) 1px,transparent 1px),linear-gradient(90deg,rgba(34,197,94,0.07) 1px,transparent 1px)",
            backgroundSize: "48px 48px",
            animation: "gridPulse 4s ease-in-out infinite",
            pointerEvents: "none",
          }}
        />

        {/* Glow */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle,rgba(34,197,94,0.07) 0%,transparent 70%)",
            pointerEvents: "none",
          }}
        />

        {/* Content */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            textAlign: "center",
            padding: "2rem",
          }}
        >
          {/* 404 */}
          <div className="nf-fade nf-fade-1">
            <span
              style={{
                fontFamily: "var(--font-pixel,'Press Start 2P',monospace)",
                fontSize: "clamp(4rem,15vw,8rem)",
                color: "#22c55e",
                textShadow:
                  "0 0 40px rgba(34,197,94,0.4), 0 0 80px rgba(34,197,94,0.15)",
                display: "block",
                lineHeight: 1,
                letterSpacing: "-0.02em",
              }}
            >
              404
            </span>
          </div>

          {/* Terminal line */}
          <div
            className="nf-fade nf-fade-2"
            style={{ margin: "1.5rem 0 1rem" }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "0.5rem 1rem",
                borderRadius: "8px",
                background: isDark
                  ? "rgba(255,255,255,0.04)"
                  : "rgba(0,0,0,0.04)",
                border: `1px solid ${isDark ? "rgba(34,197,94,0.15)" : "rgba(34,197,94,0.2)"}`,
              }}
            >
              <Terminal size={12} style={{ color: "#22c55e", opacity: 0.7 }} />
              <span
                style={{
                  fontFamily: "var(--font-pixel,'Press Start 2P',monospace)",
                  fontSize: "0.45rem",
                  color: "#22c55e",
                  opacity: 0.7,
                  letterSpacing: "0.08em",
                }}
              >
                page not found
              </span>
              <span className="cursor" />
            </div>
          </div>

          {/* Message */}
          <div className="nf-fade nf-fade-2">
            <p
              style={{
                fontFamily: "var(--font-body,Syne,sans-serif)",
                fontSize: "clamp(0.9rem,2vw,1.05rem)",
                color: textMuted,
                lineHeight: 1.8,
                maxWidth: "420px",
                margin: "0 auto 2.5rem",
              }}
            >
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>

          {/* CTA */}
          <div
            className="nf-fade nf-fade-3"
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Link href="/" className="nf-btn" style={{ color: textMain }}>
              ← Go Home
            </Link>
            <Link
              href="/projects"
              className="nf-btn"
              style={{ color: textMain }}
            >
              View Projects
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
