"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Terminal,
  LayoutDashboard,
  Cpu,
  Link2,
  Star,
  Award,
  Briefcase,
  FileText,
  FolderOpen,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

const NAV = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Skills", href: "/dashboard/skills", icon: Cpu },
  { label: "Links", href: "/dashboard/links", icon: Link2 },
  { label: "Reviews", href: "/dashboard/reviews", icon: Star },
  { label: "Certs", href: "/dashboard/certs", icon: Award },
  { label: "XPs", href: "/dashboard/xps", icon: Briefcase },
  { label: "Projects", href: "/dashboard/projects", icon: FolderOpen },
  { label: "Articles", href: "/dashboard/articles", icon: FileText },
];

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/dashboard/login");
  };

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === href : pathname.startsWith(href);

  const NavLinks = ({ onNavigate }: { onNavigate?: () => void }) => (
    <nav
      style={{
        padding: "0.5rem 0.75rem",
        flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: "2px",
      }}
    >
      {NAV.map(({ label, href, icon: Icon }) => {
        const active = isActive(href);
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "0.6rem 0.75rem",
              borderRadius: "8px",
              fontSize: "0.82rem",
              fontWeight: 600,
              letterSpacing: "0.02em",
              textDecoration: "none",
              background: active ? "rgba(34,197,94,0.1)" : "transparent",
              color: active ? "#22c55e" : "rgba(248,250,252,0.55)",
              borderLeft: active
                ? "2px solid #22c55e"
                : "2px solid transparent",
              transition: "background 0.15s, color 0.15s",
            }}
            onMouseEnter={(e) => {
              if (!active) {
                (e.currentTarget as HTMLAnchorElement).style.background =
                  "rgba(255,255,255,0.04)";
                (e.currentTarget as HTMLAnchorElement).style.color =
                  "rgba(248,250,252,0.85)";
              }
            }}
            onMouseLeave={(e) => {
              if (!active) {
                (e.currentTarget as HTMLAnchorElement).style.background =
                  "transparent";
                (e.currentTarget as HTMLAnchorElement).style.color =
                  "rgba(248,250,252,0.55)";
              }
            }}
          >
            <Icon size={15} />
            {label}
          </Link>
        );
      })}
    </nav>
  );

  const LogoutBtn = () => (
    <div
      style={{
        padding: "0.75rem",
        borderTop: "1px solid rgba(34,197,94,0.08)",
        flexShrink: 0,
      }}
    >
      <button
        onClick={handleLogout}
        disabled={loggingOut}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "0.6rem 0.75rem",
          borderRadius: "8px",
          width: "100%",
          fontSize: "0.82rem",
          fontWeight: 600,
          background: "transparent",
          border: "none",
          cursor: "pointer",
          color: "rgba(239,68,68,0.7)",
          transition: "background 0.15s, color 0.15s",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background =
            "rgba(239,68,68,0.08)";
          (e.currentTarget as HTMLButtonElement).style.color = "rgb(239,68,68)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background =
            "transparent";
          (e.currentTarget as HTMLButtonElement).style.color =
            "rgba(239,68,68,0.7)";
        }}
      >
        <LogOut size={15} />
        {loggingOut ? "Logging out..." : "Logout"}
      </button>
    </div>
  );

  const Logo = () => (
    <div
      style={{
        padding: "1.25rem 1.25rem",
        borderBottom: "1px solid rgba(34,197,94,0.08)",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        flexShrink: 0,
      }}
    >
      <Terminal size={12} style={{ color: "#22c55e", opacity: 0.7 }} />
      <span
        style={{
          fontFamily: "var(--font-pixel,'Press Start 2P',monospace)",
          fontSize: "0.6rem",
          color: "#22c55e",
          textShadow: "0 0 10px rgba(34,197,94,0.3)",
        }}
      >
        3bod Sa
      </span>
    </div>
  );

  const SectionLabel = () => (
    <div style={{ padding: "1rem 1.25rem 0.5rem" }}>
      <span
        style={{
          fontFamily: "var(--font-pixel,'Press Start 2P',monospace)",
          fontSize: "0.38rem",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "rgba(34,197,94,0.5)",
        }}
      >
        Dashboard
      </span>
    </div>
  );

  return (
    <>
      <style>{`
        @keyframes slideIn { from{transform:translateX(-100%)} to{transform:translateX(0)} }
        @keyframes overlayFade { from{opacity:0} to{opacity:1} }
        .mobile-drawer { animation: slideIn 0.22s cubic-bezier(0.4,0,0.2,1) forwards; }
        .mobile-overlay { animation: overlayFade 0.2s ease forwards; }

        /* Desktop sidebar */
        @media (min-width: 768px) {
          .dash-sidebar { display: flex !important; }
          .dash-topbar  { display: none !important; }
        }
        /* Mobile */
        @media (max-width: 767px) {
          .dash-sidebar { display: none !important; }
          .dash-topbar  { display: flex !important; }
        }
      `}</style>

      <div
        style={{
          display: "flex",
          minHeight: "100vh",
          background: "#090b0e",
          fontFamily: "var(--font-body,Syne,sans-serif)",
        }}
      >
        {/* ── Desktop sidebar ─────────────────────────────────── */}
        <aside
          className="dash-sidebar"
          style={{
            width: "220px",
            flexShrink: 0,
            background: "rgba(255,255,255,0.02)",
            borderRight: "1px solid rgba(34,197,94,0.1)",
            flexDirection: "column",
            position: "sticky",
            top: 0,
            height: "100vh",
            overflowY: "auto",
          }}
        >
          <Logo />
          <SectionLabel />
          <NavLinks />
          <LogoutBtn />
        </aside>

        {/* ── Mobile top bar ──────────────────────────────────── */}
        <div
          className="dash-topbar"
          style={{
            display: "none",
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 40,
            height: "56px",
            background: "#090b0e",
            borderBottom: "1px solid rgba(34,197,94,0.1)",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 1rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Terminal size={12} style={{ color: "#22c55e", opacity: 0.7 }} />
            <span
              style={{
                fontFamily: "var(--font-pixel,'Press Start 2P',monospace)",
                fontSize: "0.55rem",
                color: "#22c55e",
              }}
            >
              3bod Sa
            </span>
          </div>
          <button
            onClick={() => setMobileOpen(true)}
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "8px",
              border: "1px solid rgba(34,197,94,0.2)",
              background: "transparent",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "rgba(248,250,252,0.7)",
            }}
          >
            <Menu size={18} />
          </button>
        </div>

        {/* ── Mobile drawer ───────────────────────────────────── */}
        {mobileOpen && (
          <>
            {/* Overlay */}
            <div
              className="mobile-overlay"
              onClick={() => setMobileOpen(false)}
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 50,
                background: "rgba(0,0,0,0.7)",
                backdropFilter: "blur(4px)",
              }}
            />
            {/* Drawer */}
            <div
              className="mobile-drawer"
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                bottom: 0,
                zIndex: 51,
                width: "260px",
                background: "#0a0d10",
                borderRight: "1px solid rgba(34,197,94,0.15)",
                display: "flex",
                flexDirection: "column",
                boxShadow: "8px 0 32px rgba(0,0,0,0.5)",
              }}
            >
              {/* Drawer header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "1.25rem",
                  borderBottom: "1px solid rgba(34,197,94,0.08)",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <Terminal
                    size={12}
                    style={{ color: "#22c55e", opacity: 0.7 }}
                  />
                  <span
                    style={{
                      fontFamily:
                        "var(--font-pixel,'Press Start 2P',monospace)",
                      fontSize: "0.6rem",
                      color: "#22c55e",
                    }}
                  >
                    3bod Sa
                  </span>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  style={{
                    width: "30px",
                    height: "30px",
                    borderRadius: "7px",
                    border: "1px solid rgba(255,255,255,0.1)",
                    background: "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    color: "rgba(248,250,252,0.5)",
                  }}
                >
                  <X size={15} />
                </button>
              </div>
              <SectionLabel />
              <NavLinks onNavigate={() => setMobileOpen(false)} />
              <LogoutBtn />
            </div>
          </>
        )}

        {/* ── Main content ────────────────────────────────────── */}
        <main
          style={{
            flex: 1,
            overflowY: "auto",
            minHeight: "100vh",
            paddingTop: "0",
          }}
          className="dash-main"
        >
          {/* Spacer for mobile topbar */}
          <div
            style={{ height: "56px", display: "none" }}
            className="dash-mobile-spacer"
          />
          <style>{`
            @media (max-width: 767px) {
              .dash-mobile-spacer { display: block !important; }
            }
          `}</style>
          {children}
        </main>
      </div>
    </>
  );
}
