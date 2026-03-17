"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { BsStarFill, BsQuote } from "react-icons/bs";
import { FaLinkedin } from "react-icons/fa";
import { BiLink, BiLinkExternal } from "react-icons/bi";
import { reviews } from "@/public/data";

const PAD = "clamp(1rem, 8vw, 10rem)";

export default function Reviews() {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const swiperRef = useRef<any>(null);

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
    const el = document.getElementById("reviews-section");
    if (el) obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const current = theme === "system" ? systemTheme : theme;
  const isDark = mounted ? current === "dark" : true;

  /* ── pixel grid canvas ──────────────────────────── */
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

    const PX = 24;
    const GAP = 4;
    const CELL = PX + GAP;
    const VIRTUAL = 300;
    const ROWS = 30;

    const grid: { alpha: number; lit: boolean }[][] = Array.from(
      { length: ROWS },
      () =>
        Array.from({ length: VIRTUAL }, () => ({
          alpha: Math.random() * 0.06 + 0.02,
          lit: Math.random() < 0.18,
        })),
    );

    let raf: number;
    let scrollX = 0;
    let displayX = 0;
    const EASE = 0.06;

    const draw = () => {
      // continuous slow auto-drift when swiper isn't manually scrolled
      scrollX += 0.35;
      displayX += (scrollX - displayX) * EASE;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const visRows = Math.ceil(canvas.height / CELL) + 1;
      const visCols = Math.ceil(canvas.width / CELL) + 3;
      const cellShift = displayX / CELL;
      const whole = Math.floor(cellShift);
      const subPx = -(cellShift - whole) * CELL;

      for (let r = 0; r < visRows; r++) {
        for (let c = 0; c < visCols; c++) {
          const vc = (((whole + c) % VIRTUAL) + VIRTUAL) % VIRTUAL;
          const cell = grid[r % ROWS][vc];
          if (!cell.lit) continue;

          const x = c * CELL + subPx;
          const y = r * CELL;

          ctx.fillStyle = `rgba(34,197,94,${cell.alpha})`;
          ctx.fillRect(x, y, PX, PX);

          const ac = Math.min(cell.alpha * 2, 0.12);
          ctx.fillStyle = `rgba(34,197,94,${ac})`;
          ctx.fillRect(x, y, 3, 3);
          ctx.fillRect(x + PX - 3, y + PX - 3, 3, 3);
        }
      }

      raf = requestAnimationFrame(draw);
    };

    window.addEventListener("resize", resize);
    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [isDark]);

  const bg = isDark ? "rgb(9,11,14)" : "#f8fafc";
  const textMain = isDark ? "#f8fafc" : "#090b0e";
  const textMuted = isDark ? "rgba(248,250,252,0.8)" : "rgba(9,11,14,0.8)";
  const cardBg = isDark ? "rgba(255,255,255,0.10)" : "#ffffff";
  const cardBorder = isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)";

  return (
    <>
      <style>{`
        #reviews-section .swiper { padding-bottom: 3rem !important; }

        #reviews-section .swiper-pagination-bullet {
          width: 8px; height: 8px;
          background: transparent;
          border: 1.5px solid rgba(34,197,94,0.4);
          opacity: 1;
          transition: background 0.2s, transform 0.2s, border-color 0.2s, box-shadow 0.2s;
        }
        #reviews-section .swiper-pagination-bullet-active {
          background: #22c55e !important;
          border-color: #22c55e !important;
          transform: scale(1.3);
          box-shadow: 0 0 8px rgba(34,197,94,0.5);
        }

        #reviews-section .swiper-button-prev,
        #reviews-section .swiper-button-next { display: none !important; }

        .review-card {
          border-radius: 16px;
          border: 1px solid;
          padding: 1.75rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          height: 100%;
          position: relative;
          overflow: hidden;
          transition: transform 0.3s, box-shadow 0.3s, border-color 0.3s;
        }
        .review-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(to right, transparent, #22c55e55, transparent);
          opacity: 0;
          transition: opacity 0.3s;
        }
        .review-card:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(34,197,94,0.09); border-color: rgba(34,197,94,0.28) !important; }
        .review-card:hover::before { opacity: 1; }

        .review-quote-icon { position: absolute; top: 1rem; right: 1.25rem; font-size: 2.5rem; color: rgba(34,197,94,0.08); line-height: 1; }
        .review-content { font-family: var(--font-body, Syne, sans-serif); font-size: 0.88rem; line-height: 1.8; font-style: italic; flex: 1; }
        .review-name { font-family: var(--font-body, Syne, sans-serif); font-size: 0.88rem; font-weight: 700; letter-spacing: 0.02em; margin: 0; }
        .review-stars { display: flex; gap: 3px; }

        .section-label { font-family: var(--font-pixel, 'Press Start 2P', monospace); font-size: 0.5rem; letter-spacing: 0.12em; text-transform: uppercase; color: #22c55e; opacity: 0.8; }
        .section-title { font-family: var(--font-pixel, 'Press Start 2P', monospace); line-height: 1.5; margin: 0; }
      `}</style>

      <section
        id="reviews-section"
        style={{
          position: "relative",
          background: bg,
          paddingTop: "6rem",
          paddingBottom: "6rem",
          transition: "background 0.3s",
          overflow: "hidden",
        }}
      >
        {/* Canvas */}
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

        <div style={{ position: "relative", zIndex: 1 }}>
          {/* Header */}
          <div
            style={{
              paddingLeft: PAD,
              paddingRight: PAD,
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.6s ease, transform 0.6s ease",
              marginBottom: "3rem",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "1rem",
                width: "100%",
              }}
            >
              <div>
                <p
                  className="section-label"
                  style={{ marginBottom: "0.75rem" }}
                >
                  What people say
                </p>
                <h2
                  className="section-title"
                  style={{
                    fontSize: "clamp(1rem, 3vw, 1.6rem)",
                    color: textMain,
                  }}
                >
                  Reviews
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
              <div style={{ display: "flex", gap: "0.5rem" }}>
                {(["‹", "›"] as const).map((arrow, i) => (
                  <button
                    key={i}
                    onClick={() =>
                      i === 0
                        ? swiperRef.current?.slidePrev()
                        : swiperRef.current?.slideNext()
                    }
                    style={{
                      width: "38px",
                      height: "38px",
                      borderRadius: "9px",
                      border: "1.5px solid rgba(34,197,94,0.3)",
                      background: "transparent",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      fontSize: "1.1rem",
                      color: textMuted,
                      transition: "border-color 0.2s, background 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.borderColor =
                        "#22c55e";
                      (e.currentTarget as HTMLButtonElement).style.background =
                        "rgba(34,197,94,0.08)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.borderColor =
                        "rgba(34,197,94,0.3)";
                      (e.currentTarget as HTMLButtonElement).style.background =
                        "transparent";
                    }}
                  >
                    {arrow}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Swiper */}
          <div
            style={{
              paddingLeft: PAD,
              opacity: visible ? 1 : 0,
              transition: "opacity 0.6s ease 0.2s",
            }}
          >
            <Swiper
              modules={[Autoplay, Pagination, Navigation]}
              slidesPerView="auto"
              spaceBetween={20}
              loop={true}
              autoplay={{
                delay: 3200,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              pagination={{ clickable: true }}
              navigation={true}
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
              }}
              grabCursor={true}
              style={{ paddingRight: "2rem", overflow: "visible" }}
            >
              {reviews.map((r, i) => (
                <SwiperSlide key={i} style={{ width: "340px" }}>
                  <div
                    className="review-card"
                    style={{ background: cardBg, borderColor: cardBorder }}
                  >
                    <BsQuote className="review-quote-icon" />

                    <div className="review-stars">
                      {Array.from({ length: 5 }).map((_, s) => (
                        <BsStarFill
                          key={s}
                          style={{ fontSize: "0.7rem", color: "#fbbf24" }}
                        />
                      ))}
                    </div>

                    <p className="review-content" style={{ color: textMuted }}>
                      "{r.content}"
                    </p>

                    <div style={{ height: "1px", background: cardBorder }} />

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        <div
                          style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "50%",
                            background: "rgba(34,197,94,0.12)",
                            border: "1.5px solid rgba(34,197,94,0.3)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "0.85rem",
                            fontWeight: 700,
                            color: "#22c55e",
                            fontFamily: "var(--font-body, Syne, sans-serif)",
                            flexShrink: 0,
                          }}
                        >
                          {r.name[0]}
                        </div>
                        <h4 className="review-name" style={{ color: textMain }}>
                          {r.name}
                        </h4>
                      </div>

                      {r.link && (
                        <a
                          href={r.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            width: "30px",
                            height: "30px",
                            borderRadius: "8px",
                            border: "1px solid rgba(34,197,94,0.25)",
                            background: "rgba(34,197,94,0.06)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#22c55e",
                            fontSize: "0.8rem",
                            transition: "background 0.2s",
                            flexShrink: 0,
                            textDecoration: "none",
                          }}
                          onMouseEnter={(e) => {
                            (
                              e.currentTarget as HTMLAnchorElement
                            ).style.background = "rgba(34,197,94,0.14)";
                          }}
                          onMouseLeave={(e) => {
                            (
                              e.currentTarget as HTMLAnchorElement
                            ).style.background = "rgba(34,197,94,0.06)";
                          }}
                        >
                          <BiLinkExternal />
                        </a>
                      )}
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </section>
    </>
  );
}
