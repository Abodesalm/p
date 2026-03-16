"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Menu, X, Terminal } from "lucide-react";
import { BiMoon, BiSun } from "react-icons/bi";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Articles", href: "/articles" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const current = theme === "system" ? systemTheme : theme;
  const isDark = mounted ? current === "dark" : true;

  const bg = isDark
    ? scrolled
      ? "rgba(9,11,14,0.97)"
      : "rgba(9,11,14,0.9)"
    : scrolled
      ? "rgba(248,250,252,0.97)"
      : "rgba(248,250,252,0.82)";
  const border = isDark ? "rgba(34,197,94,0.12)" : "rgba(34,197,94,0.22)";
  const shadow = scrolled
    ? isDark
      ? "0 4px 32px rgba(0,0,0,0.6)"
      : "0 4px 24px rgba(0,0,0,0.08)"
    : "none";
  const textColor = isDark ? "rgba(248,250,252,0.75)" : "rgba(9,11,14,0.75)";
  const subColor = isDark ? "rgba(248,250,252,0.35)" : "rgba(9,11,14,0.35)";
  const sheetBg = isDark ? "#090b0e" : "#f8fafc";
  const iconColor = isDark ? "rgba(248,250,252,0.75)" : "rgba(9,11,14,0.75)";

  // clamp: 1rem on mobile → 10rem on wide screen
  const navPadding = "clamp(1rem, 8vw, 10rem)";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Syne:wght@400;500;600;700&display=swap');
        * { font-family: 'Syne', sans-serif; }

        .logo-text {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.75rem;
          color: #22c55e;
          text-shadow: 0 0 10px rgba(34,197,94,0.3);
          transition: text-shadow 0.3s;
        }
        .logo-text:hover {
          text-shadow: 0 0 20px rgba(34,197,94,0.5), 0 0 40px rgba(34,197,94,0.3);
        }

        .nav-link {
          font-weight: 600;
          font-size: 0.8rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          position: relative;
          padding-bottom: 2px;
          transition: color 0.2s;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -2px; left: 0;
          height: 2px; width: 0;
          background: #22c55e;
          box-shadow: 0 0 8px #22c55e;
          border-radius: 2px;
          transition: width 0.3s cubic-bezier(.4,0,.2,1);
        }
        .nav-link:hover { color: #22c55e !important; }
        .nav-link:hover::after, .nav-link.active::after { width: 100%; }
        .nav-link.active { color: #22c55e !important; }

        .mobile-link {
          display: block;
          font-weight: 600;
          font-size: 0.9rem;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          padding: 0.7rem 1rem;
          border-radius: 0.5rem;
          transition: background 0.2s, color 0.2s;
        }
        .mobile-link:hover { background: rgba(34,197,94,0.1); color: #22c55e !important; }
        .mobile-link.active { background: rgba(34,197,94,0.1); color: #22c55e !important; }

        .icon-btn {
          width: 36px; height: 36px;
          border-radius: 8px;
          border: 1.5px solid rgba(34,197,94,0.3);
          display: flex; align-items: center; justify-content: center;
          background: transparent;
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
        }
        .icon-btn:hover {
          border-color: #22c55e;
          background: rgba(34,197,94,0.08);
          box-shadow: 0 0 10px rgba(34,197,94,0.25);
        }

        .bracket {
          font-family: 'Press Start 2P', monospace;
          font-size: 0.45rem;
          color: rgba(34,197,94,0.5);
          padding: 0 3px;
        }
      `}</style>

      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          background: bg,
          borderBottom: `1px solid ${border}`,
          boxShadow: shadow,
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          transition: "background 0.3s, box-shadow 0.3s",
        }}
      >
        <nav
          style={{
            width: "100%",
            paddingLeft: navPadding,
            paddingRight: navPadding,
            height: "60px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* ── Logo ─────────────────────────── */}
          <Link
            href="/"
            style={{ display: "flex", alignItems: "center", gap: "8px" }}
          >
            <Terminal size={13} style={{ color: "#22c55e", opacity: 0.6 }} />
            <span className="logo-text">3bod Sa</span>
          </Link>

          {/* ── Desktop links ────────────────── */}
          {!isMobile && (
            <ul
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1.75rem",
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
                    className={cn("nav-link", pathname === href && "active")}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {/* ── Right controls ───────────────── */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {/* Theme toggle — icon-btn style */}
            <button
              className="icon-btn"
              style={{ color: iconColor }}
              onClick={() => setTheme(isDark ? "light" : "dark")}
              aria-label="Toggle theme"
            >
              {mounted &&
                (isDark ? (
                  <BiSun style={{ fontSize: 16, color: "#facc15" }} />
                ) : (
                  <BiMoon style={{ fontSize: 16, color: "#64748b" }} />
                ))}
            </button>

            {/* Hamburger — mobile only */}
            {isMobile && (
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild>
                  <button
                    className="icon-btn"
                    style={{ color: iconColor }}
                    aria-label="Open menu"
                  >
                    {mobileOpen ? <X size={17} /> : <Menu size={17} />}
                  </button>
                </SheetTrigger>

                <SheetContent
                  side="right"
                  style={{
                    width: "270px",
                    padding: 0,
                    background: sheetBg,
                    borderLeft: `1px solid ${border}`,
                  }}
                >
                  {/* Header */}
                  <div
                    style={{
                      padding: "1rem 1.25rem",
                      borderBottom: `1px solid ${border}`,
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <Terminal
                      size={11}
                      style={{ color: "#22c55e", opacity: 0.7 }}
                    />
                    <span className="logo-text">3bod Sa</span>
                  </div>

                  {/* Links */}
                  <nav
                    style={{
                      padding: "1.25rem 0.75rem",
                      display: "flex",
                      flexDirection: "column",
                      gap: "4px",
                    }}
                  >
                    <p
                      style={{
                        color: subColor,
                        fontSize: "0.65rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.15em",
                        padding: "0 0.5rem",
                        marginBottom: "0.75rem",
                        fontWeight: 600,
                      }}
                    >
                      Navigation
                    </p>
                    {navLinks.map(({ label, href }) => (
                      <Link
                        key={href}
                        href={href}
                        style={{ color: textColor }}
                        className={cn(
                          "mobile-link",
                          pathname === href && "active",
                        )}
                        onClick={() => setMobileOpen(false)}
                      >
                        <span className="bracket">[</span>
                        {label}
                        <span className="bracket">]</span>
                      </Link>
                    ))}
                  </nav>

                  {/* Footer */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: "1.25rem",
                      left: "1.25rem",
                      right: "1.25rem",
                      borderTop: `1px solid ${border}`,
                      paddingTop: "1rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span
                      style={{
                        color: subColor,
                        fontSize: "0.65rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        fontWeight: 600,
                      }}
                    >
                      Theme
                    </span>
                    <button
                      className="icon-btn"
                      style={{ color: iconColor }}
                      onClick={() => setTheme(isDark ? "light" : "dark")}
                      aria-label="Toggle theme"
                    >
                      {mounted &&
                        (isDark ? (
                          <BiSun style={{ fontSize: 14, color: "#facc15" }} />
                        ) : (
                          <BiMoon style={{ fontSize: 14, color: "#64748b" }} />
                        ))}
                    </button>
                  </div>
                </SheetContent>
              </Sheet>
            )}
          </div>
        </nav>
      </header>

      <div style={{ height: "60px" }} />
    </>
  );
}
