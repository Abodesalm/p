"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock, Calendar } from "lucide-react";
import { marked } from "marked";

const PAD = "clamp(1rem, 8vw, 10rem)";

interface Article {
  _id: string;
  title: string;
  author?: string;
  cover?: string;
  date?: string;
  readTime?: number;
  content: string;
}
interface Props {
  article: Article;
}

function formatDate(d?: string) {
  if (!d) return "";
  const dt = new Date(d);
  return `${String(dt.getDate()).padStart(2, "0")}/${String(dt.getMonth() + 1).padStart(2, "0")}/${dt.getFullYear()}`;
}

function parseContent(text: string): string {
  return text
    .replace(/::g\[([^\]]+)\]/g, '<span class="md-green">$1</span>')
    .replace(/::d\[([^\]]+)\]/g, '<span class="md-red">$1</span>')
    .replace(/::p\[([^\]]+)\]/g, '<span class="md-purple">$1</span>');
}

export default function ArticlePage({ article }: Props) {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [html, setHtml] = useState("");

  useEffect(() => {
    setMounted(true);
    setTimeout(() => setVisible(true), 80);
  }, []);

  // 8 — set html lang to "ar" for article pages
  useEffect(() => {
    document.documentElement.lang = "ar";
    document.documentElement.dir = "rtl";
    return () => {
      document.documentElement.lang = "en";
      document.documentElement.dir = "ltr";
    };
  }, []);

  useEffect(() => {
    const parsed = marked.parse(parseContent(article.content)) as string;
    setHtml(parsed);
  }, [article.content]);

  const current = theme === "system" ? systemTheme : theme;
  const isDark = mounted ? current === "dark" : true;
  const bg = isDark ? "#090b0e" : "#f8fafc";
  const textMain = isDark ? "#f8fafc" : "#090b0e";
  const textMuted = isDark ? "rgba(248,250,252,0.5)" : "rgba(9,11,14,0.5)";
  const cardBorder = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Arabic:wght@300;400;500;600;700&display=swap');
        .article-body { font-family:'IBM Plex Arabic',sans-serif; font-size:clamp(1rem,1.5vw,1.1rem); line-height:2.1; color:${isDark ? "rgba(248,250,252,0.85)" : "rgba(9,11,14,0.85)"}; direction:rtl; text-align:right; max-width:900px; margin:0 auto; word-break:break-word; }
        .article-body h1 { font-size:clamp(1.5rem,3vw,2rem); font-weight:700; color:${textMain}; margin:2rem 0 1rem; line-height:1.4; }
        .article-body h2 { font-size:clamp(1.2rem,2.5vw,1.5rem); font-weight:700; color:${textMain}; margin:1.75rem 0 0.85rem; border-bottom:1px solid ${cardBorder}; padding-bottom:0.5rem; }
        .article-body h3 { font-size:clamp(1rem,2vw,1.2rem); font-weight:700; color:${textMain}; margin:1.5rem 0 0.7rem; }
        .article-body p  { margin:0.85rem 0; }
        .article-body a  { color:#22c55e; text-decoration:underline; text-decoration-color:rgba(34,197,94,0.35); transition:text-decoration-color 0.2s; }
        .article-body a:hover { text-decoration-color:#22c55e; }
        .article-body strong { color:${textMain}; font-weight:700; }
        .article-body em { font-style:italic; color:${isDark ? "rgba(248,250,252,0.65)" : "rgba(9,11,14,0.65)"}; }
        .article-body code { font-family:'Courier New',monospace; background:${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}; padding:2px 7px; border-radius:5px; font-size:0.88em; color:#22c55e; direction:ltr; display:inline-block; }
        .article-body pre { background:${isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"}; border:1px solid ${cardBorder}; border-radius:12px; padding:1.25rem; overflow-x:auto; margin:1.25rem 0; direction:ltr; text-align:left; }
        .article-body pre code { background:none; padding:0; color:${isDark ? "#e2e8f0" : "#090b0e"}; }
        .article-body ul,.article-body ol { padding-right:1.75rem; padding-left:0; margin:0.75rem 0; }
        .article-body li { margin:0.4rem 0; }
        .article-body blockquote { border-right:3px solid #22c55e; border-left:none; padding:0.6rem 1.1rem 0.6rem 0; margin:1.25rem 0; color:${textMuted}; background:${isDark ? "rgba(34,197,94,0.04)" : "rgba(34,197,94,0.03)"}; border-radius:0 8px 8px 0; }
        .article-body hr { border:none; border-top:1px solid ${cardBorder}; margin:2rem 0; }
        .article-body img { max-width:100%; border-radius:12px; margin:1rem 0; }
        .article-body table { width:100%; border-collapse:collapse; margin:1rem 0; }
        .article-body th,.article-body td { padding:0.6rem 0.85rem; border:1px solid ${cardBorder}; text-align:right; }
        .article-body th { background:${isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"}; font-weight:700; }
        .md-green  { color:#22c55e; }
        .md-red    { color:rgb(239,68,68); }
        .md-purple { color:#a78bfa; }
        .back-link { display:inline-flex; align-items:center; gap:6px; font-family:var(--font-body,Syne,sans-serif); font-size:0.82rem; font-weight:600; color:${textMuted}; text-decoration:none; transition:color 0.2s; }
        .back-link:hover { color:#22c55e; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .fade-in { opacity:0; animation:fadeUp 0.6s ease 0.1s forwards; }
      `}</style>

      <div
        style={{
          background: bg,
          minHeight: "100vh",
          transition: "background 0.3s",
        }}
      >
        {/* Cover */}
        {article.cover && (
          <div
            style={{
              width: "100%",
              maxHeight: "480px",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <Image
              src={article.cover}
              alt={article.title}
              width={1600}
              height={640}
              priority
              style={{
                width: "100%",
                maxHeight: "480px",
                objectFit: "cover",
                display: "block",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: `linear-gradient(to bottom,transparent 40%,${bg} 100%)`,
              }}
            />
          </div>
        )}

        <div
          style={{
            paddingLeft: PAD,
            paddingRight: PAD,
            paddingTop: article.cover ? "1rem" : "7rem",
            paddingBottom: "6rem",
          }}
        >
          {/* Back */}
          <div
            className={visible ? "fade-in" : ""}
            style={{ marginBottom: "2rem" }}
          >
            <Link href="/articles" className="back-link">
              <ArrowRight size={14} /> العودة إلى المقالات
            </Link>
          </div>

          {/* Header */}
          <div
            className={visible ? "fade-in" : ""}
            style={{
              maxWidth: "900px",
              margin: "0 auto",
              marginBottom: "3rem",
              textAlign: "right",
              direction: "rtl",
            }}
          >
            <h1
              style={{
                fontFamily: "'IBM Plex Arabic',sans-serif",
                fontSize: "clamp(1.5rem,4vw,2.4rem)",
                fontWeight: 700,
                color: textMain,
                lineHeight: 1.45,
                margin: "0 0 1.25rem 0",
              }}
            >
              {article.title}
            </h1>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1.25rem",
                flexWrap: "wrap",
                justifyContent: "flex-end",
                marginBottom: "2rem",
              }}
            >
              {article.author && (
                <span
                  style={{
                    fontFamily: "'IBM Plex Arabic',sans-serif",
                    fontSize: "0.88rem",
                    fontWeight: 600,
                    color: "#22c55e",
                  }}
                >
                  {article.author}
                </span>
              )}
              {article.date && (
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "5px",
                    fontFamily: "'IBM Plex Arabic',sans-serif",
                    fontSize: "0.82rem",
                    color: textMuted,
                  }}
                >
                  <Calendar size={13} style={{ color: "#22c55e" }} />
                  {formatDate(article.date)}
                </span>
              )}
              {article.readTime && (
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "5px",
                    fontFamily: "'IBM Plex Arabic',sans-serif",
                    fontSize: "0.82rem",
                    color: textMuted,
                  }}
                >
                  <Clock size={13} style={{ color: "#22c55e" }} />
                  {article.readTime} دقيقة للقراءة
                </span>
              )}
            </div>

            <div
              style={{
                height: "1px",
                background: `linear-gradient(to left,#22c55e,${cardBorder},transparent)`,
              }}
            />
          </div>

          {/* Body */}
          <div
            className={`article-body${visible ? " fade-in" : ""}`}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </div>
    </>
  );
}
