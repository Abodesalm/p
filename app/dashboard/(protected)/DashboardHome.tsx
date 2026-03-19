"use client";

import Link from "next/link";
import {
  Cpu,
  Link2,
  Star,
  FolderOpen,
  Briefcase,
  Award,
  FileText,
  ArrowRight,
} from "lucide-react";

const MODELS = [
  {
    label: "Skills",
    href: "/dashboard/skills",
    icon: Cpu,
    color: "#38bdf8",
    ready: true,
  },
  {
    label: "Links",
    href: "/dashboard/links",
    icon: Link2,
    color: "#a78bfa",
    ready: true,
  },
  {
    label: "Reviews",
    href: "/dashboard/reviews",
    icon: Star,
    color: "#fbbf24",
    ready: true,
  },
  {
    label: "Certs",
    href: "/dashboard/certs",
    icon: Award,
    color: "#34d399",
    ready: true,
  },
  {
    label: "XPs",
    href: "/dashboard/xps",
    icon: Briefcase,
    color: "#fb923c",
    ready: true,
  },
  {
    label: "Articles",
    href: "/dashboard/articles",
    icon: FileText,
    color: "#f472b6",
    ready: true,
  },
  {
    label: "Projects",
    href: "/dashboard/projects",
    icon: FolderOpen,
    color: "#22c55e",
    ready: true,
  },
];

interface Props {
  counts: Record<string, number>;
}

export default function DashboardHome({ counts }: Props) {
  return (
    <div style={{ padding: "2.5rem", maxWidth: "900px" }}>
      <div style={{ marginBottom: "2.5rem" }}>
        <span
          style={{
            fontFamily: "var(--font-pixel,'Press Start 2P',monospace)",
            fontSize: "0.45rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#22c55e",
            opacity: 0.7,
          }}
        >
          Admin Panel
        </span>
        <h1
          style={{
            fontFamily: "var(--font-pixel,'Press Start 2P',monospace)",
            fontSize: "clamp(0.9rem,2vw,1.2rem)",
            color: "#f8fafc",
            margin: "0.75rem 0 0.5rem 0",
            lineHeight: 1.5,
          }}
        >
          Overview
        </h1>
        <p
          style={{
            fontFamily: "var(--font-body,Syne,sans-serif)",
            fontSize: "0.85rem",
            color: "rgba(248,250,252,0.45)",
            margin: 0,
          }}
        >
          Manage all your portfolio content from here.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: "1rem",
        }}
      >
        {MODELS.map(({ label, href, icon: Icon, color, ready }) => {
          const count = counts[label.toLowerCase()] ?? 0;

          const card = (
            <div
              style={{
                padding: "1.5rem",
                borderRadius: "14px",
                border: `1px solid ${ready ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.04)"}`,
                background: ready
                  ? "rgba(255,255,255,0.03)"
                  : "rgba(255,255,255,0.01)",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                cursor: ready ? "pointer" : "default",
                transition:
                  "transform 0.2s, box-shadow 0.2s, border-color 0.2s",
                opacity: ready ? 1 : 0.5,
                position: "relative",
                overflow: "hidden",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => {
                if (ready) {
                  (e.currentTarget as HTMLElement).style.transform =
                    "translateY(-3px)";
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    `0 12px 32px ${color}22`;
                  (e.currentTarget as HTMLElement).style.borderColor =
                    `${color}44`;
                }
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform =
                  "translateY(0)";
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
                (e.currentTarget as HTMLElement).style.borderColor = ready
                  ? "rgba(255,255,255,0.07)"
                  : "rgba(255,255,255,0.04)";
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "2px",
                  background: `linear-gradient(to right, ${color}, transparent)`,
                  opacity: ready ? 0.6 : 0.2,
                }}
              />
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "10px",
                    background: `${color}15`,
                    border: `1px solid ${color}33`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon size={18} style={{ color }} />
                </div>
                {ready ? (
                  <ArrowRight
                    size={15}
                    style={{ color: "rgba(248,250,252,0.3)" }}
                  />
                ) : (
                  <span
                    style={{
                      fontFamily:
                        "var(--font-pixel,'Press Start 2P',monospace)",
                      fontSize: "0.35rem",
                      color: "rgba(248,250,252,0.3)",
                      letterSpacing: "0.08em",
                    }}
                  >
                    soon
                  </span>
                )}
              </div>
              <div>
                <p
                  style={{
                    fontFamily: "var(--font-body,Syne,sans-serif)",
                    fontSize: "1rem",
                    fontWeight: 700,
                    color: "#f8fafc",
                    margin: "0 0 4px 0",
                  }}
                >
                  {label}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-pixel,'Press Start 2P',monospace)",
                    fontSize: "0.5rem",
                    color,
                    margin: 0,
                  }}
                >
                  {count} {count === 1 ? "doc" : "docs"}
                </p>
              </div>
            </div>
          );

          return ready ? (
            <Link key={label} href={href} style={{ textDecoration: "none" }}>
              {card}
            </Link>
          ) : (
            <div key={label}>{card}</div>
          );
        })}
      </div>
    </div>
  );
}
