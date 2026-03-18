"use client";

import { useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import Icon from "@/components/layout/Icon";
import { info } from "@/public/data";
import {
  BsEnvelope,
  BsTelephone,
  BsGeoAlt,
  BsArrowRight,
  BsCheckCircleFill,
  BsExclamationCircleFill,
} from "react-icons/bs";

const PAD = "clamp(1rem, 8vw, 10rem)";

interface LinkItem {
  _id: string;
  title: string;
  url: string;
  icon: string;
}
interface Props {
  links: LinkItem[];
}

type FormState = "idle" | "loading" | "success" | "error";

export default function ContactClient({ links }: Props) {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Form state
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    setMounted(true);
    setTimeout(() => setVisible(true), 80);
  }, []);

  const current = theme === "system" ? systemTheme : theme;
  const isDark = mounted ? current === "dark" : true;
  const bg = isDark ? "#090b0e" : "#f8fafc";
  const bgAlt = isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)";
  const textMain = isDark ? "#f8fafc" : "#090b0e";
  const textMuted = isDark ? "rgba(248,250,252,0.55)" : "rgba(9,11,14,0.55)";
  const cardBg = isDark ? "rgba(255,255,255,0.03)" : "#ffffff";
  const cardBorder = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)";
  const inputBg = isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)";
  const inputBorder = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.12)";

  /* animated canvas — subtle dot grid */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    let raf: number,
      t = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const size = 40;
      t += 0.008;
      for (let x = 0; x < canvas.width; x += size) {
        for (let y = 0; y < canvas.height; y += size) {
          const dist = Math.sqrt(
            (x - canvas.width / 2) ** 2 + (y - canvas.height / 2) ** 2,
          );
          const alpha =
            (1 -
              dist /
                Math.sqrt((canvas.width / 2) ** 2 + (canvas.height / 2) ** 2)) *
            0.25 *
            (0.5 + 0.5 * Math.sin(t + dist * 0.015));
          if (alpha > 0.015) {
            ctx.beginPath();
            ctx.arc(x, y, 1, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(34,197,94,${alpha})`;
            ctx.fill();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [isDark]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setStatus("error");
      setErrorMsg("Please fill in all required fields.");
      return;
    }
    setStatus("loading");
    // Build mailto link as fallback — replace with your email API if needed
    try {
      const mailtoLink = `mailto:${info.email}?subject=${encodeURIComponent(form.subject || "Contact from Portfolio")}&body=${encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`)}`;
      window.location.href = mailtoLink;
      setStatus("success");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      setStatus("error");
      setErrorMsg("Something went wrong. Please try again.");
    }
  };

  const contactCards = [
    {
      icon: <BsEnvelope />,
      label: "Email",
      value: info.email,
      href: `mailto:${info.email}`,
    },
    {
      icon: <BsTelephone />,
      label: "Phone",
      value: info.number,
      href: `tel:${info.number.replace(/\s/g, "")}`,
    },
    { icon: <BsGeoAlt />, label: "Location", value: info.address, href: null },
  ];

  return (
    <>
      <style>{`
        .contact-input {
          width: 100%;
          padding: 0.75rem 1rem;
          border-radius: 10px;
          border: 1.5px solid;
          font-family: var(--font-body, Syne, sans-serif);
          font-size: 0.85rem;
          font-weight: 500;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          resize: none;
          box-sizing: border-box;
        }
        .contact-input:focus {
          border-color: #22c55e;
          box-shadow: 0 0 0 3px rgba(34,197,94,0.12);
        }
        .contact-input::placeholder { opacity: 0.45; }

        .submit-btn {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 0.8rem 2rem; border-radius: 10px;
          border: 1.5px solid #22c55e; background: #22c55e; color: #090b0e;
          font-family: var(--font-body, Syne, sans-serif); font-weight: 700;
          font-size: 0.85rem; letter-spacing: 0.06em; text-transform: uppercase;
          cursor: pointer; transition: background 0.2s, box-shadow 0.2s, transform 0.2s;
          width: 100%;
          justify-content: center;
        }
        .submit-btn:hover:not(:disabled) { background: transparent; color: #22c55e; box-shadow: 0 0 20px rgba(34,197,94,0.35); }
        .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .contact-card {
          display: flex; align-items: center; gap: 1rem;
          padding: 1.1rem 1.25rem; border-radius: 12px;
          border: 1px solid; transition: transform 0.22s, box-shadow 0.22s, border-color 0.22s;
          text-decoration: none;
        }
        .contact-card:hover {
          transform: translateX(5px);
          box-shadow: 0 6px 24px rgba(34,197,94,0.08);
          border-color: rgba(34,197,94,0.3) !important;
        }
        .contact-card-icon {
          width: 40px; height: 40px; border-radius: 10px; flex-shrink: 0;
          border: 1.5px solid rgba(34,197,94,0.3);
          background: rgba(34,197,94,0.07);
          display: flex; align-items: center; justify-content: center;
          font-size: 1rem; color: #22c55e;
          transition: background 0.22s, box-shadow 0.22s;
        }
        .contact-card:hover .contact-card-icon {
          background: rgba(34,197,94,0.14);
          box-shadow: 0 0 12px rgba(34,197,94,0.25);
        }
        .contact-card-label {
          font-family: var(--font-pixel, 'Press Start 2P', monospace);
          font-size: 0.4rem; letter-spacing: 0.1em; text-transform: uppercase;
          color: #22c55e; opacity: 0.7; margin-bottom: 4px;
        }
        .contact-card-value {
          font-family: var(--font-body, Syne, sans-serif);
          font-size: 0.88rem; font-weight: 600; letter-spacing: 0.01em;
        }

        .social-link {
          width: 42px; height: 42px; border-radius: 10px;
          border: 1.5px solid rgba(34,197,94,0.2);
          background: rgba(34,197,94,0.04);
          display: flex; align-items: center; justify-content: center;
          font-size: 1.05rem; text-decoration: none;
          transition: border-color 0.2s, background 0.2s, color 0.2s, transform 0.2s, box-shadow 0.2s;
        }
        .social-link:hover {
          border-color: #22c55e;
          background: rgba(34,197,94,0.1);
          color: #22c55e !important;
          transform: translateY(-3px);
          box-shadow: 0 6px 16px rgba(34,197,94,0.2);
        }

        .form-label {
          font-family: var(--font-body, Syne, sans-serif);
          font-size: 0.75rem; font-weight: 700; letter-spacing: 0.06em;
          text-transform: uppercase; margin-bottom: 0.4rem; display: block;
        }

        .section-label { font-family:var(--font-pixel,'Press Start 2P',monospace); font-size:0.5rem; letter-spacing:0.12em; text-transform:uppercase; color:#22c55e; opacity:0.8; }
        .section-title { font-family:var(--font-pixel,'Press Start 2P',monospace); line-height:1.5; margin:0; }

        .status-bar {
          display: flex; align-items: center; gap: 0.6rem;
          padding: 0.75rem 1rem; border-radius: 10px; border: 1px solid;
          font-family: var(--font-body, Syne, sans-serif); font-size: 0.83rem; font-weight: 600;
        }

        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .fade-up-1 { opacity:0; animation: fadeUp 0.6s ease 0.1s forwards; }
        .fade-up-2 { opacity:0; animation: fadeUp 0.6s ease 0.2s forwards; }
        .fade-up-3 { opacity:0; animation: fadeUp 0.6s ease 0.3s forwards; }

        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner { display: inline-block; width: 14px; height: 14px; border: 2px solid rgba(9,11,14,0.3); border-top-color: #090b0e; border-radius: 50%; animation: spin 0.7s linear infinite; }
      `}</style>

      <div
        style={{
          background: bg,
          minHeight: "100vh",
          transition: "background 0.3s",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Canvas BG */}
        <canvas
          ref={canvasRef}
          style={{
            position: "fixed",
            inset: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            zIndex: 0,
            opacity: 0.6,
          }}
        />

        {/* Radial glow */}
        <div
          style={{
            position: "fixed",
            top: "-20%",
            right: "-10%",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle,rgba(34,197,94,0.05) 0%,transparent 70%)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 1,
            paddingLeft: PAD,
            paddingRight: PAD,
            paddingTop: "7rem",
            paddingBottom: "6rem",
          }}
        >
          {/* ── Page header ───────────────────────────────────────── */}
          <div
            className={visible ? "fade-up-1" : ""}
            style={{ marginBottom: "3.5rem" }}
          >
            <p className="section-label" style={{ marginBottom: "0.75rem" }}>
              Get in touch
            </p>
            <h1
              className="section-title"
              style={{ fontSize: "clamp(1.2rem,4vw,2rem)", color: textMain }}
            >
              Contact
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
            <p
              style={{
                marginTop: "1.25rem",
                fontFamily: "var(--font-body,Syne,sans-serif)",
                fontSize: "0.9rem",
                color: textMuted,
                maxWidth: "480px",
                lineHeight: 1.75,
              }}
            >
              Have a project in mind or want to work together? Fill out the form
              or reach me directly through any of the channels below.
            </p>
          </div>

          {/* ── Two-column layout ─────────────────────────────────── */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "3rem",
              alignItems: "start",
            }}
            className="contact-grid"
          >
            {/* ── Left: Info + Socials ──────────────────────────── */}
            <div
              className={visible ? "fade-up-2" : ""}
              style={{ display: "flex", flexDirection: "column", gap: "2rem" }}
            >
              {/* Contact cards */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                }}
              >
                {contactCards.map(({ icon, label, value, href }) =>
                  href ? (
                    <a
                      key={label}
                      href={href}
                      className="contact-card"
                      style={{
                        background: cardBg,
                        borderColor: cardBorder,
                        color: textMain,
                      }}
                    >
                      <div className="contact-card-icon">{icon}</div>
                      <div>
                        <p className="contact-card-label">{label}</p>
                        <span
                          className="contact-card-value"
                          style={{ color: textMain }}
                        >
                          {value}
                        </span>
                      </div>
                      <BsArrowRight
                        style={{
                          marginLeft: "auto",
                          color: "#22c55e",
                          opacity: 0.5,
                          fontSize: "0.85rem",
                        }}
                      />
                    </a>
                  ) : (
                    <div
                      key={label}
                      className="contact-card"
                      style={{ background: cardBg, borderColor: cardBorder }}
                    >
                      <div className="contact-card-icon">{icon}</div>
                      <div>
                        <p className="contact-card-label">{label}</p>
                        <span
                          className="contact-card-value"
                          style={{ color: textMain }}
                        >
                          {value}
                        </span>
                      </div>
                    </div>
                  ),
                )}
              </div>

              {/* Divider */}
              <div style={{ height: "1px", background: cardBorder }} />

              {/* Social links */}
              <div>
                <p
                  style={{
                    fontFamily: "var(--font-pixel,'Press Start 2P',monospace)",
                    fontSize: "0.45rem",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "#22c55e",
                    opacity: 0.7,
                    marginBottom: "1rem",
                  }}
                >
                  Find me on
                </p>
                <div
                  style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem" }}
                >
                  {links.map(({ _id, title, url, icon }) => (
                    <a
                      key={_id}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-link"
                      style={{ color: textMuted }}
                      aria-label={title}
                      title={title}
                    >
                      <Icon i={icon} />
                    </a>
                  ))}
                </div>
              </div>

              {/* Availability card */}
              <div
                style={{
                  padding: "1.25rem",
                  borderRadius: "14px",
                  border: `1px solid rgba(34,197,94,0.2)`,
                  background: "rgba(34,197,94,0.04)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "0.6rem",
                  }}
                >
                  <span
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: "#22c55e",
                      boxShadow: "0 0 8px #22c55e",
                      display: "inline-block",
                      animation: "pulse-dot 2s ease-in-out infinite",
                    }}
                  />
                  <span
                    style={{
                      fontFamily:
                        "var(--font-pixel,'Press Start 2P',monospace)",
                      fontSize: "0.45rem",
                      letterSpacing: "0.1em",
                      color: "#22c55e",
                    }}
                  >
                    Available for work
                  </span>
                </div>
                <p
                  style={{
                    fontFamily: "var(--font-body,Syne,sans-serif)",
                    fontSize: "0.83rem",
                    color: textMuted,
                    lineHeight: 1.7,
                    margin: 0,
                  }}
                >
                  Currently open to freelance projects, full-time roles, and
                  collaborations. Response time is usually within 24 hours.
                </p>
                <style>{`@keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.75)} }`}</style>
              </div>
            </div>

            {/* ── Right: Contact form ───────────────────────────── */}
            <div className={visible ? "fade-up-3" : ""}>
              <div
                style={{
                  padding: "2rem",
                  borderRadius: "16px",
                  border: `1px solid ${cardBorder}`,
                  background: cardBg,
                }}
              >
                <h2
                  style={{
                    fontFamily: "var(--font-body,Syne,sans-serif)",
                    fontSize: "1.1rem",
                    fontWeight: 700,
                    color: textMain,
                    margin: "0 0 1.5rem 0",
                    letterSpacing: "0.02em",
                  }}
                >
                  Send a message
                </h2>

                <form
                  onSubmit={handleSubmit}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1.1rem",
                  }}
                >
                  {/* Name + Email row */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "1rem",
                    }}
                  >
                    <div>
                      <label
                        className="form-label"
                        style={{ color: textMuted }}
                      >
                        Name <span style={{ color: "#22c55e" }}>*</span>
                      </label>
                      <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Abdurrahman"
                        className="contact-input"
                        style={{
                          background: inputBg,
                          borderColor: inputBorder,
                          color: textMain,
                        }}
                      />
                    </div>
                    <div>
                      <label
                        className="form-label"
                        style={{ color: textMuted }}
                      >
                        Email <span style={{ color: "#22c55e" }}>*</span>
                      </label>
                      <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        className="contact-input"
                        style={{
                          background: inputBg,
                          borderColor: inputBorder,
                          color: textMain,
                        }}
                      />
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="form-label" style={{ color: textMuted }}>
                      Subject
                    </label>
                    <input
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      placeholder="Project inquiry / collaboration..."
                      className="contact-input"
                      style={{
                        background: inputBg,
                        borderColor: inputBorder,
                        color: textMain,
                      }}
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="form-label" style={{ color: textMuted }}>
                      Message <span style={{ color: "#22c55e" }}>*</span>
                    </label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Tell me about your project, timeline, and budget..."
                      rows={6}
                      className="contact-input"
                      style={{
                        background: inputBg,
                        borderColor: inputBorder,
                        color: textMain,
                      }}
                    />
                  </div>

                  {/* Status bar */}
                  {status === "success" && (
                    <div
                      className="status-bar"
                      style={{
                        borderColor: "rgba(34,197,94,0.3)",
                        background: "rgba(34,197,94,0.06)",
                        color: "#22c55e",
                      }}
                    >
                      <BsCheckCircleFill style={{ flexShrink: 0 }} />
                      Your mail client should open shortly. If not, email me
                      directly at {info.email}
                    </div>
                  )}
                  {status === "error" && (
                    <div
                      className="status-bar"
                      style={{
                        borderColor: "rgba(239,68,68,0.3)",
                        background: "rgba(239,68,68,0.06)",
                        color: "rgb(239,68,68)",
                      }}
                    >
                      <BsExclamationCircleFill style={{ flexShrink: 0 }} />
                      {errorMsg}
                    </div>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    className="submit-btn"
                    disabled={status === "loading"}
                  >
                    {status === "loading" ? (
                      <>
                        <span className="spinner" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message <BsArrowRight />
                      </>
                    )}
                  </button>

                  <p
                    style={{
                      fontFamily: "var(--font-body,Syne,sans-serif)",
                      fontSize: "0.72rem",
                      color: textMuted,
                      textAlign: "center",
                      margin: 0,
                      lineHeight: 1.6,
                    }}
                  >
                    This opens your mail client. You can also reach me directly
                    at{" "}
                    <a
                      href={`mailto:${info.email}`}
                      style={{ color: "#22c55e", textDecoration: "none" }}
                    >
                      {info.email}
                    </a>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Responsive grid */}
      <style>{`
        @media (max-width: 720px) {
          .contact-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
}
