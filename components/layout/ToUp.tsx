"use client";

import { useEffect, useState } from "react";
import { BiChevronUp } from "react-icons/bi";

export default function ToUp() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Scroll to top"
      style={{
        position: "fixed",
        bottom: "2rem",
        right: "2rem",
        zIndex: 50,
        width: "42px",
        height: "42px",
        borderRadius: "10px",
        border: "1.5px solid rgba(34,197,94,0.4)",
        background: "rgba(34,197,94,0.08)",
        color: "#22c55e",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
        transform: visible ? "translateY(0)" : "translateY(12px)",
        transition:
          "opacity 0.3s, transform 0.3s, box-shadow 0.2s, background 0.2s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.boxShadow =
          "0 0 14px rgba(34,197,94,0.35)";
        (e.currentTarget as HTMLButtonElement).style.background =
          "rgba(34,197,94,0.15)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
        (e.currentTarget as HTMLButtonElement).style.background =
          "rgba(34,197,94,0.08)";
      }}
    >
      <BiChevronUp style={{ fontSize: 22 }} />
    </button>
  );
}
