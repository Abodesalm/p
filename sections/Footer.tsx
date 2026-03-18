"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Terminal } from "lucide-react";
import Icon from "@/components/layout/Icon";
import { info, links_api } from "@/public/data";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Articles", href: "/articles" },
  { label: "Contact", href: "/contact" },
];

const PAD = "clamp(1rem, 8vw, 10rem)";

function SocialSkeleton({ isDark }: { isDark: boolean }) {
  return (
    <div
      style={{
        width: "38px",
        height: "38px",
        borderRadius: "9px",
        border: `1.5px solid ${isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}`,
        background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div className="sk-shimmer" />
    </div>
  );
}

export default function Footer() {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [links, setLinks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    fetch(links_api)
      .then((r) => r.json())
      .then((res) => setLinks(res.data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const current = theme === "system" ? systemTheme : theme;
  const isDark = mounted ? current === "dark" : true;
  const bg = isDark ? "#090b0e" : "#f1f5f9";
  const borderColor = isDark ? "rgba(34,197,94,0.12)" : "rgba(34,197,94,0.2)";
  const textColor = isDark ? "rgba(248,250,252,0.65)" : "rgba(9,11,14,0.65)";
  const mutedColor = isDark ? "rgba(248,250,252,0.35)" : "rgba(9,11,14,0.35)";
  const year = new Date().getFullYear();

  return (
    <>
      <style>{`
        .footer-nav-link {
          font-weight: 600; font-size: 0.78rem; letter-spacing: 0.08em;
          text-transform: uppercase; position: relative; padding-bottom: 2px; transition: color 0.2s;
        }
        .footer-nav-link::after {
          content: ''; position: absolute; bottom: -2px; left: 0;
          height: 1.5px; width: 0; background: #22c55e; box-shadow: 0 0 6px #22c55e;
          border-radius: 2px; transition: width 0.3s cubic-bezier(.4,0,.2,1);
        }
        .footer-nav-link:hover { color: #22c55e !important; }
        .footer-nav-link:hover::after { width: 100%; }

        .social-btn {
          width: 38px; height: 38px; border-radius: 9px;
          border: 1.5px solid rgba(34,197,94,0.25);
          display: flex; align-items: center; justify-content: center;
          font-size: 1rem; background: transparent; cursor: pointer;
          transition: border-color 0.2s, background 0.2s, color 0.2s, box-shadow 0.2s;
          text-decoration: none;
        }
        .social-btn:hover { border-color: #22c55e; background: rgba(34,197,94,0.1); color: #22c55e !important; box-shadow: 0 0 10px rgba(34,197,94,0.25); }

        .footer-logo-text {
          font-family: var(--font-pixel, 'Press Start 2P', monospace);
          font-size: 0.75rem; color: #22c55e; text-shadow: 0 0 10px rgba(34,197,94,0.3);
        }
        .footer-label {
          font-family: var(--font-pixel, 'Press Start 2P', monospace);
          font-size: 0.5rem; letter-spacing: 0.1em; text-transform: uppercase;
          color: #22c55e; opacity: 0.7; margin-bottom: 1rem;
        }

        @keyframes sk-sweep { 0%{transform:translateX(-100%)} 100%{transform:translateX(100%)} }
        .sk-shimmer { position: absolute; inset: 0; background: linear-gradient(90deg, transparent 0%, rgba(34,197,94,0.08) 50%, transparent 100%); animation: sk-sweep 1.4s infinite; }
      `}</style>

      <footer
        style={{
          background: bg,
          borderTop: `1px solid ${borderColor}`,
          transition: "background 0.3s",
        }}
      >
        {/* ── Main content ─────────────────────────────── */}
        <div
          style={{
            paddingLeft: PAD,
            paddingRight: PAD,
            paddingTop: "3rem",
            paddingBottom: "2rem",
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "2.5rem",
          }}
          className="sm:grid-cols-1 md:grid-cols-3"
        >
          {/* Col 1 — Brand */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Terminal size={13} style={{ color: "#22c55e", opacity: 0.7 }} />
              <span className="footer-logo-text">3bod Sa</span>
            </div>
            <p
              style={{
                color: textColor,
                fontSize: "0.85rem",
                lineHeight: 1.7,
                maxWidth: "260px",
                fontFamily: "var(--font-body, Syne, sans-serif)",
              }}
            >
              {info.hero_sentence}
            </p>
            <a
              href={`mailto:${info.email}`}
              style={{
                color: "#22c55e",
                fontSize: "0.8rem",
                fontWeight: 600,
                letterSpacing: "0.04em",
                fontFamily: "var(--font-body, Syne, sans-serif)",
                textDecoration: "none",
                opacity: 0.85,
                transition: "opacity 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.85")}
            >
              {info.email}
            </a>
          </div>

          {/* Col 2 — Nav */}
          <div>
            <p className="footer-label">Navigation</p>
            <ul
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
                listStyle: "none",
                margin: 0,
                padding: 0,
              }}
            >
              {navLinks.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    style={{ color: textColor }}
                    className="footer-nav-link"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Socials */}
          <div>
            <p className="footer-label">Find me on</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem" }}>
              {loading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <SocialSkeleton key={i} isDark={isDark} />
                  ))
                : links.map(({ _id, title, url, icon }) => (
                    <a
                      key={_id}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-btn"
                      style={{ color: textColor }}
                      aria-label={title}
                      title={title}
                    >
                      <Icon i={icon} />
                    </a>
                  ))}
            </div>
          </div>
        </div>

        {/* ── Bottom bar ──────────────────────────────── */}
        <div
          style={{
            paddingLeft: PAD,
            paddingRight: PAD,
            paddingTop: "1.25rem",
            paddingBottom: "1.25rem",
            borderTop: `1px solid ${borderColor}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "0.5rem",
          }}
        >
          <span
            style={{
              color: mutedColor,
              fontSize: "0.75rem",
              fontFamily: "var(--font-body, Syne, sans-serif)",
              fontWeight: 500,
            }}
          >
            © {year} <span style={{ color: "#22c55e" }}>3bod Sa</span>. All
            rights reserved.
          </span>
          <span
            style={{
              color: mutedColor,
              fontSize: "0.72rem",
              fontFamily: "var(--font-pixel, 'Press Start 2P', monospace)",
              letterSpacing: "0.06em",
            }}
          >
            v1.0.0
          </span>
        </div>
      </footer>
    </>
  );
}
