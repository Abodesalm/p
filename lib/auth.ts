export function verifyAdmin(req: Request) {
  const token = req.headers.get("authorization");

  if (!token || token !== `Bearer ${process.env.ADMIN_SECRET}`) {
    throw new Error("Unauthorized");
  }
}
