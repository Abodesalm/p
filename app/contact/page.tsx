import type { Metadata } from "next";
import { connectDB } from "@/lib/db";
import { Links } from "@/models/Links";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Abdurrahman Assalim — available for freelance projects, collaborations, and full-time roles.",
  openGraph: {
    title: "Contact | 3bod Sa",
    description:
      "Reach out to Abdurrahman Assalim for web development and design projects.",
    url: "https://3bod.sy/contact",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Contact | 3bod Sa",
  },
};

export const revalidate = 3600;

export default async function ContactPage() {
  await connectDB();
  const links = await Links.find({ hidden: { $ne: true } }).lean();
  return <ContactClient links={JSON.parse(JSON.stringify(links))} />;
}
