"use client";

interface FieldProps {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}

export function Field({ label, required, hint, children }: FieldProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
      <label
        style={{
          fontFamily: "var(--font-body,Syne,sans-serif)",
          fontSize: "0.75rem",
          fontWeight: 700,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: "rgba(248,250,252,0.55)",
        }}
      >
        {label} {required && <span style={{ color: "#22c55e" }}>*</span>}
      </label>
      {children}
      {hint && (
        <span
          style={{
            fontFamily: "var(--font-body,Syne,sans-serif)",
            fontSize: "0.72rem",
            color: "rgba(248,250,252,0.3)",
            lineHeight: 1.5,
          }}
        >
          {hint}
        </span>
      )}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.65rem 0.85rem",
  borderRadius: "9px",
  border: "1.5px solid rgba(255,255,255,0.08)",
  background: "rgba(255,255,255,0.04)",
  color: "#f8fafc",
  fontFamily: "var(--font-body,Syne,sans-serif)",
  fontSize: "0.85rem",
  fontWeight: 500,
  outline: "none",
  boxSizing: "border-box" as const,
  transition: "border-color 0.2s, box-shadow 0.2s",
};

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      style={{ ...inputStyle, ...props.style }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = "#22c55e";
        e.currentTarget.style.boxShadow = "0 0 0 3px rgba(34,197,94,0.12)";
        props.onFocus?.(e);
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
        e.currentTarget.style.boxShadow = "none";
        props.onBlur?.(e);
      }}
    />
  );
}

export function Textarea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>,
) {
  return (
    <textarea
      {...props}
      style={{
        ...inputStyle,
        resize: "vertical",
        minHeight: "100px",
        ...props.style,
      }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = "#22c55e";
        e.currentTarget.style.boxShadow = "0 0 0 3px rgba(34,197,94,0.12)";
        props.onFocus?.(e);
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
        e.currentTarget.style.boxShadow = "none";
        props.onBlur?.(e);
      }}
    />
  );
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      style={{ ...inputStyle, cursor: "pointer", ...props.style }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = "#22c55e";
        e.currentTarget.style.boxShadow = "0 0 0 3px rgba(34,197,94,0.12)";
        props.onFocus?.(e);
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
        e.currentTarget.style.boxShadow = "none";
        props.onBlur?.(e);
      }}
    />
  );
}

export function SubmitBtn({
  loading,
  isEdit,
}: {
  loading: boolean;
  isEdit: boolean;
}) {
  return (
    <button
      type="submit"
      disabled={loading}
      style={{
        width: "100%",
        padding: "0.75rem",
        borderRadius: "10px",
        border: "1.5px solid #22c55e",
        background: "#22c55e",
        color: "#090b0e",
        fontFamily: "var(--font-body,Syne,sans-serif)",
        fontWeight: 700,
        fontSize: "0.85rem",
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        cursor: loading ? "not-allowed" : "pointer",
        opacity: loading ? 0.7 : 1,
        transition: "background 0.2s, box-shadow 0.2s",
      }}
      onMouseEnter={(e) => {
        if (!loading) {
          (e.currentTarget as HTMLButtonElement).style.background =
            "transparent";
          (e.currentTarget as HTMLButtonElement).style.color = "#22c55e";
          (e.currentTarget as HTMLButtonElement).style.boxShadow =
            "0 0 20px rgba(34,197,94,0.3)";
        }
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = "#22c55e";
        (e.currentTarget as HTMLButtonElement).style.color = "#090b0e";
        (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
      }}
    >
      {loading ? "Saving..." : isEdit ? "Update" : "Add"}
    </button>
  );
}
