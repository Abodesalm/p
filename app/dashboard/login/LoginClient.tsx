"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Terminal, Lock, Eye, EyeOff } from "lucide-react";

export default function LoginClient() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError("Enter your password.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.status === "success") {
        router.push("/dashboard");
        router.refresh();
      } else {
        setError("Wrong password. Try again.");
      }
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .login-card { animation: fadeUp 0.5s ease forwards; }
        .login-input { width:100%; padding:0.75rem 1rem 0.75rem 2.75rem; border-radius:10px; border:1.5px solid rgba(255,255,255,0.08); background:rgba(255,255,255,0.04); color:#f8fafc; font-family:var(--font-body,Syne,sans-serif); font-size:0.88rem; outline:none; box-sizing:border-box; transition:border-color 0.2s,box-shadow 0.2s; }
        .login-input:focus { border-color:#22c55e; box-shadow:0 0 0 3px rgba(34,197,94,0.12); }
        .login-input::placeholder { color:rgba(248,250,252,0.25); }
        @keyframes gridPulse { 0%,100%{opacity:0.4} 50%{opacity:0.7} }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          background: "#090b0e",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(34,197,94,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(34,197,94,0.04) 1px,transparent 1px)",
            backgroundSize: "48px 48px",
            animation: "gridPulse 4s ease-in-out infinite",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle,rgba(34,197,94,0.06) 0%,transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div
          className="login-card"
          style={{
            position: "relative",
            zIndex: 1,
            width: "min(400px,90vw)",
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(34,197,94,0.15)",
            borderRadius: "20px",
            padding: "2.5rem",
            backdropFilter: "blur(12px)",
            boxShadow: "0 32px 80px rgba(0,0,0,0.5)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "2rem",
            }}
          >
            <Terminal size={14} style={{ color: "#22c55e", opacity: 0.8 }} />
            <span
              style={{
                fontFamily: "var(--font-pixel,'Press Start 2P',monospace)",
                fontSize: "0.65rem",
                color: "#22c55e",
                textShadow: "0 0 10px rgba(34,197,94,0.4)",
              }}
            >
              3bod Sa
            </span>
          </div>
          <h1
            style={{
              fontFamily: "var(--font-body,Syne,sans-serif)",
              fontSize: "1.4rem",
              fontWeight: 800,
              color: "#f8fafc",
              margin: "0 0 0.4rem 0",
            }}
          >
            Dashboard
          </h1>
          <p
            style={{
              fontFamily: "var(--font-body,Syne,sans-serif)",
              fontSize: "0.83rem",
              color: "rgba(248,250,252,0.45)",
              margin: "0 0 2rem 0",
            }}
          >
            Enter your password to continue
          </p>

          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <div style={{ position: "relative" }}>
              <Lock
                size={14}
                style={{
                  position: "absolute",
                  left: "0.85rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#22c55e",
                  opacity: 0.5,
                  pointerEvents: "none",
                }}
              />
              <input
                type={show ? "text" : "password"}
                className="login-input"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingRight: "2.75rem" }}
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                style={{
                  position: "absolute",
                  right: "0.85rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "rgba(248,250,252,0.35)",
                  display: "flex",
                  alignItems: "center",
                  padding: 0,
                  transition: "color 0.15s",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.color =
                    "rgba(248,250,252,0.7)")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.color =
                    "rgba(248,250,252,0.35)")
                }
              >
                {show ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>

            {error && (
              <p
                style={{
                  fontFamily: "var(--font-body,Syne,sans-serif)",
                  fontSize: "0.8rem",
                  color: "rgb(239,68,68)",
                  margin: 0,
                  padding: "0.6rem 0.85rem",
                  borderRadius: "8px",
                  background: "rgba(239,68,68,0.08)",
                  border: "1px solid rgba(239,68,68,0.2)",
                }}
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "0.8rem",
                borderRadius: "10px",
                border: "1.5px solid #22c55e",
                background: "#22c55e",
                color: "#090b0e",
                fontFamily: "var(--font-body,Syne,sans-serif)",
                fontWeight: 800,
                fontSize: "0.88rem",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
                transition: "background 0.2s,box-shadow 0.2s",
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "transparent";
                  (e.currentTarget as HTMLButtonElement).style.color =
                    "#22c55e";
                  (e.currentTarget as HTMLButtonElement).style.boxShadow =
                    "0 0 20px rgba(34,197,94,0.3)";
                }
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "#22c55e";
                (e.currentTarget as HTMLButtonElement).style.color = "#090b0e";
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
              }}
            >
              {loading ? "Verifying..." : "Enter Dashboard"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
