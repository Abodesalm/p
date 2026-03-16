import "@/public/css/globals.css";
import "./index.css";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "@/sections/Navbar";
import ToUp from "@/components/layout/ToUp";
import Providers from "./Providers";
import Footer from "@/sections/Footer";
import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "3bod Sa",
  description: "web dev",
};

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang={`en`}
      className={`${pixel.variable} ${syne.variable}`}
      suppressHydrationWarning
    >
      <body>
        <Providers>
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
