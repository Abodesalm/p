// Call after any dashboard mutation to instantly refresh public pages
// pathMap maps model name to the public paths that show its data
const PATH_MAP: Record<string, string[]> = {
  projects: ["/", "/projects"],
  skills: ["/"],
  reviews: ["/"],
  certs: ["/"],
  xps: ["/"],
  links: ["/", "/contact"],
  articles: ["/articles"],
};

export async function revalidate(model: string) {
  const paths = PATH_MAP[model] ?? ["/"];
  try {
    await fetch("/api/revalidate", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paths }),
    });
  } catch {
    // Revalidation failure is non-critical — don't block the UI
  }
}
