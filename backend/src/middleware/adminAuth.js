export function requireAdmin(req, res, next) {
  const providedKey = req.header("x-admin-key");
  const expectedKey = process.env.ADMIN_KEY || "admin123";

  if (!providedKey || providedKey !== expectedKey) {
    return res.status(401).json({
      message: "Admin access required to add caterers."
    });
  }

  return next();
}
