"use client";

import { useState, useMemo, useEffect } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Search, X } from "lucide-react";

const PAD = "clamp(1rem, 8vw, 10rem)";

interface Article {
  _id: string;
  title: string;
  author?: string;
  cover?: string;
  date?: string;
  readTime?: number;
  content?: string;
}
interface Props {
  articles: Article[];
}

function formatDate(d?: string) {
  if (!d) return "";
  const dt = new Date(d);
  return `${String(dt.getDate()).padStart(2, "0")}/${String(dt.getMonth() + 1).padStart(2, "0")}/${dt.getFullYear()}`;
}

function excerpt(content?: string, max = 120) {
  if (!content) return "";
  const clean = content
    .replace(/::g\[([^\]]+)\]/g, "$1")
    .replace(/::d\[([^\]]+)\]/g, "$1")
    .replace(/::p\[([^\]]+)\]/g, "$1")
    .replace(/[#*_`>~\[\]()]/g, "")
    .replace(/\n+/g, " ")
    .trim();
  return clean.length > max ? clean.slice(0, max) + "..." : clean;
}

export default function ArticlesClient({ articles }: Props) {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setMounted(true);
    setTimeout(() => setVisible(true), 80);
  }, []);

  const current = theme === "system" ? systemTheme : theme;
  const isDark = mounted ? current === "dark" : true;
  const bg = isDark ? "#090b0e" : "#f8fafc";
  const bgAlt = isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)";
  const textMain = isDark ? "#f8fafc" : "#090b0e";
  const textMuted = isDark ? "rgba(248,250,252,0.5)" : "rgba(9,11,14,0.5)";
  const cardBg = isDark ? "rgba(255,255,255,0.03)" : "#ffffff";
  const cardBorder = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)";
  const inputBg = isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)";
  const inputBorder = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.1)";

  const filtered = useMemo(
    () =>
      articles.filter(
        (a) =>
          !search.trim() ||
          a.title.toLowerCase().includes(search.toLowerCase()) ||
          a.author?.toLowerCase().includes(search.toLowerCase()),
      ),
    [articles, search],
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Arabic:wght@300;400;500;600;700&display=swap');
        .article-card { border-radius:16px; border:1px solid; overflow:hidden; display:flex; flex-direction:column; text-decoration:none; transition:transform 0.3s,box-shadow 0.3s,border-color 0.3s; }
        .article-card:hover { transform:translateY(-5px); box-shadow:0 16px 40px rgba(34,197,94,0.08); border-color:rgba(34,197,94,0.3) !important; }
        .cover-wrap { overflow:hidden; position:relative; aspect-ratio:16/9; }
        .article-cover { object-fit:cover; transition:transform 0.4s; }
        .article-card:hover .article-cover { transform:scale(1.03); }
        .cover-overlay { position:absolute; inset:0; background:linear-gradient(to bottom,transparent 50%,rgba(9,11,14,0.5) 100%); opacity:0; transition:opacity 0.3s; }
        .article-card:hover .cover-overlay { opacity:1; }
        .article-title { font-family:'IBM Plex Arabic',var(--font-body,Syne),sans-serif; font-size:1.05rem; font-weight:700; line-height:1.6; margin:0; direction:rtl; text-align:right; }
        .article-excerpt { font-family:'IBM Plex Arabic',var(--font-body,Syne),sans-serif; font-size:0.84rem; line-height:1.85; margin:0; direction:rtl; text-align:right; display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden; }
        .search-wrap { position:relative; max-width:360px; width:100%; }
        .search-input { width:100%; height:42px; padding:0 2.5rem 0 2.5rem; border-radius:10px; border:1.5px solid; font-family:var(--font-body,Syne,sans-serif); font-size:0.85rem; outline:none; transition:border-color 0.2s,box-shadow 0.2s; box-sizing:border-box; }
        .search-input:focus { border-color:#22c55e; box-shadow:0 0 0 3px rgba(34,197,94,0.12); }
        .search-icon { position:absolute; left:0.85rem; top:50%; transform:translateY(-50%); pointer-events:none; color:#22c55e; opacity:0.5; }
        .search-clear { position:absolute; right:0.75rem; top:50%; transform:translateY(-50%); background:none; border:none; cursor:pointer; opacity:0.4; transition:opacity 0.15s; display:flex; }
        .search-clear:hover { opacity:0.8; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .fade-up { animation:fadeUp 0.5s ease forwards; opacity:0; }
        .card-in { animation:fadeUp 0.45s ease forwards; opacity:0; }
      `}</style>

      <div
        style={{
          background: bg,
          minHeight: "100vh",
          transition: "background 0.3s",
        }}
      >
        {/* Header */}
        <div
          style={{
            paddingLeft: PAD,
            paddingRight: PAD,
            paddingTop: "7rem",
            paddingBottom: "3rem",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: isDark
                ? "repeating-linear-gradient(135deg,rgba(34,197,94,0.025) 0px,rgba(34,197,94,0.025) 1px,transparent 1px,transparent 48px)"
                : "repeating-linear-gradient(135deg,rgba(34,197,94,0.05) 0px,rgba(34,197,94,0.05) 1px,transparent 1px,transparent 48px)",
              pointerEvents: "none",
            }}
          />
          <div
            className={visible ? "fade-up" : ""}
            style={{ position: "relative", zIndex: 1 }}
          >
            <p
              style={{
                fontFamily: "var(--font-pixel,'Press Start 2P',monospace)",
                fontSize: "0.5rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#22c55e",
                opacity: 0.8,
                marginBottom: "0.75rem",
              }}
            >
              What I write
            </p>
            <h1
              style={{
                fontFamily: "var(--font-pixel,'Press Start 2P',monospace)",
                fontSize: "clamp(1.2rem,4vw,2rem)",
                color: textMain,
                margin: 0,
                lineHeight: 1.5,
              }}
            >
              Articles
            </h1>
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

        {/* Search bar */}
        <div
          style={{
            background: bgAlt,
            borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)"}`,
            borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)"}`,
            paddingLeft: PAD,
            paddingRight: PAD,
            paddingTop: "1.25rem",
            paddingBottom: "1.25rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "0.75rem",
          }}
        >
          <div className="search-wrap">
            <Search size={14} className="search-icon" />
            <input
              className="search-input"
              type="text"
              placeholder="Search articles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                background: inputBg,
                borderColor: inputBorder,
                color: textMain,
              }}
            />
            {search && (
              <button
                className="search-clear"
                style={{ color: textMain }}
                onClick={() => setSearch("")}
              >
                <X size={14} />
              </button>
            )}
          </div>
          <span
            style={{
              fontFamily: "var(--font-pixel,'Press Start 2P',monospace)",
              fontSize: "0.4rem",
              color: "rgba(34,197,94,0.6)",
              letterSpacing: "0.1em",
            }}
          >
            {filtered.length} article{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Grid */}
        <div
          style={{
            paddingLeft: PAD,
            paddingRight: PAD,
            paddingTop: "3rem",
            paddingBottom: "6rem",
          }}
        >
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "5rem 0" }}>
              <p
                style={{
                  fontFamily: "var(--font-pixel,'Press Start 2P',monospace)",
                  fontSize: "0.6rem",
                  color: "#22c55e",
                  opacity: 0.4,
                  marginBottom: "1rem",
                }}
              >
                // 404
              </p>
              <p
                style={{
                  fontFamily: "var(--font-body,Syne,sans-serif)",
                  color: textMuted,
                  margin: 0,
                }}
              >
                No articles found
              </p>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fill, minmax(min(100%, 340px), 1fr))",
                gap: "1.5rem",
              }}
            >
              {filtered.map((a, i) => (
                <Link
                  key={a._id}
                  href={`/articles/${a._id}`}
                  className="article-card card-in"
                  style={{
                    background: cardBg,
                    borderColor: cardBorder,
                    animationDelay: `${i * 70}ms`,
                  }}
                >
                  <div className="cover-wrap">
                    {a.cover ? (
                      <Image
                        src={a.cover}
                        alt={a.title}
                        fill
                        sizes="(max-width:768px) 100vw, 33vw"
                        className="article-cover"
                      />
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          background: isDark
                            ? "rgba(255,255,255,0.03)"
                            : "rgba(0,0,0,0.04)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <span
                          style={{
                            fontFamily:
                              "var(--font-pixel,'Press Start 2P',monospace)",
                            fontSize: "0.4rem",
                            color: "#22c55e",
                            opacity: 0.3,
                          }}
                        >
                          no cover
                        </span>
                      </div>
                    )}
                    <div className="cover-overlay" />
                  </div>
                  <div
                    style={{
                      padding: "1.25rem",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.65rem",
                      flex: 1,
                    }}
                  >
                    <h2 className="article-title" style={{ color: textMain }}>
                      {a.title}
                    </h2>
                    <p className="article-excerpt" style={{ color: textMuted }}>
                      {excerpt(a.content)}
                    </p>
                    <div
                      style={{
                        height: "1px",
                        background: cardBorder,
                        marginTop: "auto",
                      }}
                    />
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: "0.5rem",
                      }}
                    >
                      {a.author && (
                        <span
                          style={{
                            fontFamily: "'IBM Plex Arabic',sans-serif",
                            fontSize: "0.78rem",
                            fontWeight: 600,
                            color: "#22c55e",
                          }}
                        >
                          {a.author}
                        </span>
                      )}
                      {a.date && (
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                            fontFamily: "var(--font-body,Syne,sans-serif)",
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            color: textMuted,
                          }}
                        >
                          <Calendar size={11} style={{ color: "#22c55e" }} />
                          {formatDate(a.date)}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
