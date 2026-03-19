import "@/public/css/globals.css";
import "./index.css";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "@/sections/Navbar";
import ToUp from "@/components/layout/ToUp";
import Providers from "./Providers";
import Footer from "@/sections/Footer";
import type { Metadata } from "next";
import PageLoader from "@/components/PageLoader";
import { ToastContainer } from "react-toastify";
import { Press_Start_2P, Syne } from "next/font/google";

const pixel = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pixel",
});
const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
});

const BASE = "https://3bod.sy";

export const metadata: Metadata = {
  metadataBase: new URL(BASE),
  title: {
    default: "3bod Sa — Web Developer & Graphic Designer",
    template: "%s | 3bod Sa",
  },
  description:
    "Abdurrahman Assalim — Full-stack web developer and graphic designer based in Damascus. Building clean, fast, and memorable digital experiences.",
  keywords: [
    "web developer",
    "full stack",
    "Damascus",
    "Syria",
    "React",
    "Next.js",
    "graphic designer",
    "3bod Sa",
    "Abdurrahman Assalim",
  ],
  authors: [{ name: "Abdurrahman Assalim", url: BASE }],
  creator: "Abdurrahman Assalim",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE,
    siteName: "3bod Sa",
    title: "3bod Sa — Web Developer & Graphic Designer",
    description:
      "Full-stack web developer and graphic designer based in Damascus. Explore my projects, articles, and skills.",
  },
  twitter: {
    card: "summary_large_image",
    title: "3bod Sa — Web Developer & Graphic Designer",
    description:
      "Full-stack web developer and graphic designer based in Damascus.",
    creator: "@3bod_sa",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  verification: {
    google: "nyQLbW1HhSeoXB9WVEFuBghBV8mfw384OnFvphy7-H4",
  },
};

export default async function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${pixel.variable} ${syne.variable}`}
      suppressHydrationWarning
    >
      <body>
        <Providers>
          <PageLoader />
          <Navbar />
          <div className="w-full">{children}</div>
          <Footer />
          <ToUp />
        </Providers>
        <ToastContainer />
      </body>
    </html>
  );
}
