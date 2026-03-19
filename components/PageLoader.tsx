"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function PageLoader() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Start loading on path change
    setLoading(true);
    setVisible(true);
    setProgress(0);

    const t1 = setTimeout(() => setProgress(30), 50);
    const t2 = setTimeout(() => setProgress(60), 200);
    const t3 = setTimeout(() => setProgress(85), 500);
    const t4 = setTimeout(() => {
      setProgress(100);
      setTimeout(() => {
        setLoading(false);
        setTimeout(() => setVisible(false), 300);
      }, 200);
    }, 700);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [pathname]);

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        height: "3px",
        background: "transparent",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${progress}%`,
          background: "linear-gradient(to right, #22c55e, #86efac)",
          boxShadow:
            "0 0 10px rgba(34,197,94,0.7), 0 0 20px rgba(34,197,94,0.4)",
          borderRadius: "0 2px 2px 0",
          transition: loading
            ? "width 0.4s cubic-bezier(0.4,0,0.2,1)"
            : "width 0.15s ease, opacity 0.3s ease",
          opacity: loading ? 1 : 0,
        }}
      />
    </div>
  );
}
