import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/config"], // Paths you want to keep private
    },
    sitemap: "https://3bod.sy/sitemap.xml",
  };
}
