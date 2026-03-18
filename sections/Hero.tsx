"use client";

import { useEffect, useState, useRef } from "react";
import { useTheme } from "next-themes";
import { BiDownload } from "react-icons/bi";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { BsArrowDownShort } from "react-icons/bs";
import { info, socialLinks } from "@/public/data";

const ROLES = ["Web Developer", "Graphic Designer", "Pixel Art Enthusiast"];
const PAD = "clamp(1rem, 8vw, 10rem)";

function useTypewriter(words: string[], speed = 80, pause = 1800) {
  const [display, setDisplay] = useState("");
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    const current = words[wordIdx];
    let t: ReturnType<typeof setTimeout>;
    if (!deleting && charIdx <= current.length) {
      t = setTimeout(() => {
        setDisplay(current.slice(0, charIdx));
        setCharIdx((c) => c + 1);
        if (charIdx === current.length)
          setTimeout(() => setDeleting(true), pause);
      }, speed);
    } else if (deleting && charIdx >= 0) {
      t = setTimeout(() => {
        setDisplay(current.slice(0, charIdx));
        setCharIdx((c) => c - 1);
        if (charIdx === 0) {
          setDeleting(false);
          setWordIdx((w) => (w + 1) % words.length);
        }
      }, speed / 2);
    }
    return () => clearTimeout(t);
  }, [charIdx, deleting, wordIdx, words, speed, pause]);
  return display;
}

interface Props {
  projectsCount: number;
  skillsCount: number;
}

export default function Hero({ projectsCount, skillsCount }: Props) {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const role = useTypewriter(ROLES);

  useEffect(() => {
    setMounted(true);
    setTimeout(() => setVisible(true), 100);
  }, []);

  const current = theme === "system" ? systemTheme : theme;
  const isDark = mounted ? current === "dark" : true;
  const bg = isDark ? "#090b0e" : "#f8fafc";
  const textMain = isDark ? "#f8fafc" : "#090b0e";
  const textMuted = isDark ? "rgba(248,250,252,0.5)" : "rgba(9,11,14,0.5)";
  const cardBg = isDark ? "rgba(34,197,94,0.04)" : "rgba(34,197,94,0.06)";
  const cardBorder = isDark ? "rgba(34,197,94,0.15)" : "rgba(34,197,94,0.25)";
  const xp = new Date().getFullYear() - 2022;

  const stats = [
    { num: `${xp}+`, label: "Years of experience" },
    { num: `${projectsCount}+`, label: "Projects built" },
    { num: `${skillsCount}+`, label: "Tech skills" },
  ];

  const transition = (delay: number) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(24px)",
    transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf: number,
      t = 0;
    const draw = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const size = 48;
      ctx.strokeStyle = isDark ? "rgba(34,197,94,0.07)" : "rgba(34,197,94,0.1)";
      ctx.lineWidth = 0.5;
      for (let x = 0; x < canvas.width; x += size) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += size) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
      const cx = canvas.width / 2,
        cy = canvas.height / 2;
      t += 0.01;
      for (let x = 0; x < canvas.width; x += size)
        for (let y = 0; y < canvas.height; y += size) {
          const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2),
            maxDist = Math.sqrt(cx ** 2 + cy ** 2);
          const alpha =
            (1 - dist / maxDist) *
            0.4 *
            (0.5 + 0.5 * Math.sin(t + dist * 0.01));
          if (alpha > 0.02) {
            ctx.beginPath();
            ctx.arc(x, y, 1.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(34,197,94,${alpha})`;
            ctx.fill();
          }
        }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, [isDark]);

  return (
    <>
      <style>{`
        .hero-name { font-family:var(--font-pixel,'Press Start 2P',monospace); line-height:1.4; color:#22c55e; text-shadow:0 0 30px rgba(34,197,94,0.4),0 0 60px rgba(34,197,94,0.15); }
        .cv-btn { display:inline-flex; align-items:center; gap:8px; padding:0.75rem 1.6rem; border-radius:10px; border:1.5px solid #22c55e; background:#22c55e; color:#090b0e; font-family:var(--font-body,Syne,sans-serif); font-weight:700; font-size:0.85rem; letter-spacing:0.06em; text-transform:uppercase; cursor:pointer; text-decoration:none; transition:background 0.2s,box-shadow 0.2s,transform 0.2s; }
        .cv-btn:hover { background:transparent; color:#22c55e; box-shadow:0 0 20px rgba(34,197,94,0.35); transform:translateY(-2px); }
        .ghost-btn { display:inline-flex; align-items:center; gap:8px; padding:0.75rem 1.4rem; border-radius:10px; border:1.5px solid rgba(34,197,94,0.35); background:transparent; font-family:var(--font-body,Syne,sans-serif); font-weight:700; font-size:0.85rem; letter-spacing:0.06em; text-transform:uppercase; cursor:pointer; text-decoration:none; transition:border-color 0.2s,background 0.2s,box-shadow 0.2s,transform 0.2s; }
        .ghost-btn:hover { border-color:#22c55e; background:rgba(34,197,94,0.08); box-shadow:0 0 16px rgba(34,197,94,0.2); transform:translateY(-2px); }
        .stat-card { display:flex; flex-direction:column; gap:4px; padding:1rem 1.25rem; border-radius:12px; border:1px solid; transition:box-shadow 0.2s,transform 0.2s; }
        .stat-card:hover { box-shadow:0 0 20px rgba(34,197,94,0.15); transform:translateY(-3px); }
        .cursor-blink { display:inline-block; width:2px; height:1.1em; background:#22c55e; margin-left:3px; vertical-align:middle; animation:blink 1s step-end infinite; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        .scroll-indicator { display:flex; flex-direction:column; align-items:center; gap:4px; animation:bounce 2s ease-in-out infinite; }
        @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(6px)} }
        .tag { display:inline-flex; align-items:center; gap:6px; padding:4px 12px; border-radius:999px; font-size:0.72rem; font-weight:600; letter-spacing:0.06em; text-transform:uppercase; border:1px solid rgba(34,197,94,0.3); background:rgba(34,197,94,0.07); color:#22c55e; font-family:var(--font-body,Syne,sans-serif); }
        .tag::before { content:''; width:6px; height:6px; border-radius:50%; background:#22c55e; box-shadow:0 0 6px #22c55e; animation:pulse-dot 2s ease-in-out infinite; }
        @keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.7)} }
      `}</style>

      <section
        style={{
          position: "relative",
          minHeight: "100vh",
          background: bg,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          transition: "background 0.3s",
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: isDark
              ? "radial-gradient(ellipse 70% 60% at 50% 50%,rgba(34,197,94,0.06) 0%,transparent 70%)"
              : "radial-gradient(ellipse 70% 60% at 50% 50%,rgba(34,197,94,0.09) 0%,transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 1,
            paddingLeft: PAD,
            paddingRight: PAD,
            paddingTop: "8rem",
            paddingBottom: "5rem",
            display: "flex",
            flexDirection: "column",
            gap: "2rem",
            maxWidth: "860px",
          }}
        >
          <div style={transition(0)}>
            <span className="tag">Available for work</span>
          </div>
          <div style={transition(150)}>
            <h1
              className="hero-name"
              style={{ fontSize: "clamp(1.3rem,4vw,2.4rem)", margin: 0 }}
            >
              Abdurrahman
              <br />
              Assalim
            </h1>
          </div>
          <div
            style={{
              ...transition(300),
              display: "flex",
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-body,Syne,sans-serif)",
                fontWeight: 700,
                fontSize: "clamp(1rem,2.5vw,1.4rem)",
                color: textMuted,
                letterSpacing: "0.04em",
              }}
            >
              {role}
            </span>
            <span className="cursor-blink" />
          </div>
          <p
            style={{
              ...transition(450),
              fontFamily: "var(--font-body,Syne,sans-serif)",
              fontSize: "clamp(0.9rem,1.5vw,1rem)",
              color: textMuted,
              lineHeight: 1.8,
              maxWidth: "520px",
              margin: 0,
            }}
          >
            {info.summary}
          </p>
          <div
            style={{
              ...transition(550),
              display: "flex",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            {stats.map(({ num, label }) => (
              <div
                key={label}
                className="stat-card"
                style={{ background: cardBg, borderColor: cardBorder }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-pixel,'Press Start 2P',monospace)",
                    fontSize: "1.1rem",
                    color: "#22c55e",
                    textShadow: "0 0 12px rgba(34,197,94,0.4)",
                  }}
                >
                  {num}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-body,Syne,sans-serif)",
                    fontSize: "0.72rem",
                    color: textMuted,
                    fontWeight: 600,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                  }}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>
          <div
            style={{
              ...transition(650),
              display: "flex",
              flexWrap: "wrap",
              gap: "0.75rem",
              alignItems: "center",
            }}
          >
            <a href={info.cv_link} download className="cv-btn">
              <BiDownload style={{ fontSize: 18 }} />
              Download CV
            </a>
            <a
              href={socialLinks.find((e) => e.title === "Github")?.url}
              target="_blank"
              rel="noopener noreferrer"
              className="ghost-btn"
              style={{ color: textMain }}
            >
              <FaGithub style={{ fontSize: 16 }} />
              GitHub
            </a>
            <a
              href={socialLinks.find((e) => e.title === "LinkedIn")?.url}
              target="_blank"
              rel="noopener noreferrer"
              className="ghost-btn"
              style={{ color: textMain }}
            >
              <FaLinkedin style={{ fontSize: 16 }} />
              LinkedIn
            </a>
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: "4rem",
            left: "50%",
            transform: "translateX(-50%)",
            opacity: visible ? 0.5 : 0,
            transition: "opacity 0.7s ease 1s",
          }}
        >
          <div className="scroll-indicator">
            <span
              style={{
                fontFamily: "var(--font-pixel,'Press Start 2P',monospace)",
                fontSize: "0.45rem",
                color: "#22c55e",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              scroll
            </span>
            <BsArrowDownShort style={{ fontSize: 22, color: "#22c55e" }} />
          </div>
        </div>
      </section>
    </>
  );
}
