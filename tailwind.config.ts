const config = {
  plugins: [
    require("tailwindcss-rtl"),
    require("@tailwindcss/postcss"),
    require("tailwindcss-animate"),
  ],
  /*   plugins: {
    "@tailwindcss/postcss": {},
    "@tailwindcss-rtl":{}
  }, */
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./sections/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      sm: {
        max: "500px",
      },
      md: {
        max: "720px",
      },
      lg: {
        max: "1024px",
      },
      xl: {
        max: "1300px",
      },
    },
    extend: {
      colors: {
        green: {
          DEFAULT: "#22c55e",
          dim: "#16a34a",
          glow: "rgba(34,197,94,0.25)",
          subtle: "rgba(34,197,94,0.08)",
          border: "rgba(34,197,94,0.3)",
          "border-dim": "rgba(34,197,94,0.12)",
        },
        dark: {
          DEFAULT: "#090b0e",
          soft: "#0a0d10",
          nav: "rgba(9,11,14,0.82)",
          "nav-scrolled": "rgba(9,11,14,0.97)",
        },
        light: {
          DEFAULT: "#f8fafc",
          nav: "rgba(248,250,252,0.82)",
          "nav-scrolled": "rgba(248,250,252,0.97)",
        },
        bglight: "#EAEAEA",
        darker: "#181818",
        middark: "#212121",
        lightdark: "#444746",
        success: "#198754",
        danger: "#dc3545",
        prime: "#0d6efd",
        money: "#28B530",
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        boldGreen: "#003027",
        boldblue: "#01475f",
        acgreen: "#2a9245",
        acyellow: "#a0ce3f",
        aclight: "#cae58e",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      fontFamily: {
        pixel: ["'Press Start 2P'", "monospace"], // titles / logo
        body: ["'Syne'", "sans-serif"], // all normal text
      },
      boxShadow: {
        "green-sm": "0 0 8px rgba(34,197,94,0.25)",
        "green-md": "0 0 12px rgba(34,197,94,0.25)",
        "green-lg":
          "0 0 20px rgba(34,197,94,0.25), 0 0 40px rgba(34,197,94,0.25)",
        "nav-dark": "0 4px 32px rgba(0,0,0,0.5)",
        "nav-light": "0 4px 24px rgba(0,0,0,0.08)",
      },
      textIndent: {},
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  darkMode: ["class", "class"],
};
export default config;
